<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class LogApiActivity
{
    /**
     * Mencatat setiap request API (method, endpoint, status, durasi, pelaku)
     * ke tabel activity_logs untuk keperluan monitoring admin.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startedAt = microtime(true);

        $response = $next($request);

        // Jangan catat endpoint log itu sendiri, agar tidak membanjiri data (infinite noise)
        if ($request->is('api/admin/activity-logs')) {
            return $response;
        }

        try {
            ActivityLog::create([
                'user_id' => optional($request->user())->id,
                'method' => $request->method(),
                'endpoint' => '/' . ltrim($request->path(), '/'),
                'status_code' => $response->getStatusCode(),
                'ip_address' => $request->ip(),
                'duration_ms' => (int) round((microtime(true) - $startedAt) * 1000),
            ]);
        } catch (Throwable $e) {
            // Kegagalan logging tidak boleh mengganggu response utama ke user
            report($e);
        }

        return $response;
    }
}