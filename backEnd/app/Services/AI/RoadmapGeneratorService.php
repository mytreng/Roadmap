<?php

namespace App\Services\AI;

use App\Prompts\AI\RoadmapPrompt;

class RoadmapGeneratorService
{
    public function __construct(
        private GroqService $groq
    ) {
    }

    public function generate(array $data): array
    {
        $prompt = RoadmapPrompt::build($data);

        return $this->groq->generate(
            $prompt,
            $this->roadmapSchema()
        );
    }

    private function roadmapSchema(): array
    {
        return [
            'type' => 'object',

            'properties' => [
                'title' => [
                    'type' => 'string',
                ],

                'description' => [
                    'type' => 'string',
                ],

                'sections' => [
                    'type' => 'array',

                    'items' => [
                        'type' => 'object',

                        'properties' => [
                            'title' => [
                                'type' => 'string',
                            ],

                            'steps' => [
                                'type' => 'array',

                                'items' => [
                                    'type' => 'object',

                                    'properties' => [
                                        'title' => [
                                            'type' => 'string',
                                        ],
                                    ],

                                    'required' => [
                                        'title',
                                    ],

                                    'additionalProperties' => false,
                                ],
                            ],
                        ],

                        'required' => [
                            'title',
                            'steps',
                        ],

                        'additionalProperties' => false,
                    ],
                ],
            ],

            'required' => [
                'title',
                'description',
                'sections',
            ],

            'additionalProperties' => false,
        ];
    }
}
