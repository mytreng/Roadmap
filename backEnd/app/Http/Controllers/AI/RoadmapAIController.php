<?php

namespace App\Http\Controllers\AI;

use App\Http\Controllers\Controller;
use App\Models\Roadmap;
use App\Models\Section;
use App\Models\Step;
use App\Services\AI\RoadmapGeneratorService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class RoadmapAIController extends Controller
{
    public function generate(
        Request $request,
        RoadmapGeneratorService $generator
    ) {
        $validated = $request->validate([
            'goal' => [
                'required',
                'string',
                'min:5',
                'max:500',
            ],

            'level' => [
                'required',
                'string',
                'in:beginner,intermediate,advanced',
            ],

            'hours_per_day' => [
                'required',
                'integer',
                'min:1',
                'max:16',
            ],

            'deadline' => [
                'required',
                'date',
                'after_or_equal:today',
            ],
        ]);

        try {
            $roadmap = $generator->generate($validated);

            if (
                !is_array($roadmap) ||
                !isset($roadmap['title']) ||
                !isset($roadmap['description']) ||
                !isset($roadmap['sections']) ||
                !is_array($roadmap['sections'])
            ) {
                return response()->json([
                    'message' => 'The AI returned an invalid roadmap.',
                ], 422);
            }

            if (
                !is_string($roadmap['title']) ||
                trim($roadmap['title']) === '' ||
                strlen($roadmap['title']) > 255
            ) {
                return response()->json([
                    'message' => 'The AI returned an invalid roadmap title.',
                ], 422);
            }

            if (
                !is_string($roadmap['description']) ||
                trim($roadmap['description']) === '' ||
                strlen($roadmap['description']) > 2000
            ) {
                return response()->json([
                    'message' => 'The AI returned an invalid roadmap description.',
                ], 422);
            }

            if (
                count($roadmap['sections']) < 1 ||
                count($roadmap['sections']) > 20
            ) {
                return response()->json([
                    'message' => 'The AI returned an invalid number of sections.',
                ], 422);
            }

            $sectionTitles = [];

            foreach ($roadmap['sections'] as $section) {
                if (
                    !is_array($section) ||
                    !isset($section['title']) ||
                    !isset($section['steps']) ||
                    !is_array($section['steps'])
                ) {
                    return response()->json([
                        'message' => 'The AI returned invalid section data.',
                    ], 422);
                }

                if (
                    !is_string($section['title']) ||
                    trim($section['title']) === '' ||
                    strlen($section['title']) > 255
                ) {
                    return response()->json([
                        'message' => 'The AI returned an invalid section title.',
                    ], 422);
                }

                $normalizedSectionTitle = strtolower(
                    trim($section['title'])
                );

                if (in_array($normalizedSectionTitle, $sectionTitles, true)) {
                    return response()->json([
                        'message' => 'The AI returned duplicate sections.',
                    ], 422);
                }

                $sectionTitles[] = $normalizedSectionTitle;

                if (
                    count($section['steps']) < 1 ||
                    count($section['steps']) > 15
                ) {
                    return response()->json([
                        'message' => 'The AI returned an invalid number of steps.',
                    ], 422);
                }

                $stepTitles = [];

                foreach ($section['steps'] as $step) {
                    if (
                        !is_array($step) ||
                        !isset($step['title'])
                    ) {
                        return response()->json([
                            'message' => 'The AI returned invalid step data.',
                        ], 422);
                    }

                    if (
                        !is_string($step['title']) ||
                        trim($step['title']) === '' ||
                        strlen($step['title']) > 500
                    ) {
                        return response()->json([
                            'message' => 'The AI returned an invalid step title.',
                        ], 422);
                    }

                    $normalizedStepTitle = strtolower(
                        trim($step['title'])
                    );

                    if (in_array($normalizedStepTitle, $stepTitles, true)) {
                        return response()->json([
                            'message' => 'The AI returned duplicate steps.',
                        ], 422);
                    }

                    $stepTitles[] = $normalizedStepTitle;
                }
            }

            $startDate = Carbon::today();
            $targetDate = Carbon::parse($validated['deadline']);

            $newRoadmap = DB::transaction(function () use (
                $roadmap,
                $request,
                $startDate,
                $targetDate
            ) {
                $newRoadmap = Roadmap::create([
                    'title' => trim($roadmap['title']),
                    'description' => trim($roadmap['description']),
                    'user_id' => $request->user()->id,
                    'start_date' => $startDate,
                    'target_date' => $targetDate,
                ]);

                foreach ($roadmap['sections'] as $sectionIndex => $section) {
                    $newSection = Section::create([
                        'roadmap_id' => $newRoadmap->id,
                        'title' => trim($section['title']),
                        'order' => $sectionIndex + 1,
                    ]);

                    foreach ($section['steps'] as $step) {
                        Step::create([
                            'section_id' => $newSection->id,
                            'title' => trim($step['title']),
                            'is_completed' => false,
                        ]);
                    }
                }

                return $newRoadmap;
            });

            $newRoadmap->load('sections.steps');

            return response()->json([
                'message' => 'Roadmap generated successfully.',
                'roadmap' => $newRoadmap,
            ], 201);

        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Unable to generate the roadmap right now. Please try again.',
            ], 502);
        }
    }
}
