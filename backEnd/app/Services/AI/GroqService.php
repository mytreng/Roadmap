<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;

class GroqService
{
    public function generate(
        string $prompt,
        array $schema
    ): array {
        $response = Http::timeout(180)
            ->withToken(config('services.groq.key'))
            ->post(
                config('services.groq.url') . '/chat/completions',
                [
                    'model' => config('services.groq.model'),

                    'messages' => [
                        [
                            'role' => 'user',
                            'content' => $prompt,
                        ],
                    ],

                    'max_completion_tokens' => 12000,

                    'response_format' => [
                        'type' => 'json_schema',

                        'json_schema' => [
                            'name' => 'roadmap_response',
                            'strict' => true,
                            'schema' => $schema,
                        ],
                    ],
                ]
            );

        if ($response->failed()) {
            throw new \Exception(
                'Groq API failed: ' . $response->body()
            );
        }

        $content = $response->json(
            'choices.0.message.content'
        );

        if (!$content) {
            throw new \Exception(
                'Groq returned an empty response.'
            );
        }

        $result = json_decode($content, true);

        if (!is_array($result)) {
            throw new \Exception(
                'Invalid JSON returned by Groq: ' . $content
            );
        }

        return $result;
    }
}
