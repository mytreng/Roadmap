<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RoadmapsController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'target_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $roadmap = $request->user()->roadmaps()->create($validated);

        return response()->json([
            'message' => 'Roadmap created successfully',
            'roadmap' => $roadmap,
        ], 201);
    }
    public function index(Request $request)
    {
        $roadmaps = $request->user()
            ->roadmaps()
            ->withCount([
                'sections',
                'steps',
                'steps as completed_steps_count' => function ($query) {
                    $query->where('is_completed', true);
                },
            ])
            ->get();

        $total = $roadmaps->count();

        $roadmaps->each(function ($roadmap) {
            $roadmap->progress = $roadmap->steps_count > 0
                ? round(
                    ($roadmap->completed_steps_count / $roadmap->steps_count) * 100
                )
                : 0;
        });

        $completedCount = $roadmaps->filter(function ($roadmap) {
            return (
                $roadmap->steps_count > 0 &&
                $roadmap->completed_steps_count == $roadmap->steps_count
            );
        })->count();

        $inProgressCount = $roadmaps->filter(function ($roadmap) {
            return (
                $roadmap->completed_steps_count > 0 &&
                $roadmap->progress < 100
            );
        })->count();
        $roadmaps->each(function ($roadmap) {

            $today = Carbon::today();

            $roadmap->days_left = $roadmap->target_date !== null
                ? $today->diffInDays(
                    Carbon::parse($roadmap->target_date),
                    false
                )
                : null;
        });

        return response()->json([
            'roadmaps' => $roadmaps,

            'stats' => [
                'total' => $total,
                'completed' => $completedCount,
                'in_progress' => $inProgressCount,
            ],
        ]);
    }

    public function show($id)
    {
        $roadmaps = request()->user()->roadmaps()->findOrFail($id);

        return response()->json([
            'roadmaps' => $roadmaps,
        ]);
    }
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'start_date' => 'sometimes|nullable|date',
            'target_date' => 'sometimes|nullable|date|after_or_equal:start_date',
        ]);

        $roadmap = $request->user()->roadmaps()->findOrFail($id);

        $roadmap->update($validated);

        return response()->json([
            'message' => 'Roadmap updated successfully',
            'roadmap' => $roadmap
        ]);
    }
    public function destroy(Request $request, $id)
    {
        $roadmap = $request->user()->roadmaps()->findOrFail($id);

        $roadmap->delete();

        return response()->json([
            'message' => 'Roadmap deleted successfully'
        ]);
    }
}
