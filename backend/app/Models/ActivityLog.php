<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = ['user_id', 'method', 'endpoint', 'status_code', 'ip_address', 'duration_ms'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}