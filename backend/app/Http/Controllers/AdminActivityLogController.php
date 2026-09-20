<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class AdminActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeAdmin($request);

        $query = ActivityLog::with('user:id,name,email')->latest();

        if ($request->filled('method')) {
            $query->where('method', strtoupper($request->query('method')));
        }

        if ($request->filled('search')) {
            $query->where('endpoint', 'like', '%' . $request->query('search') . '%');
        }

        return response()->json($query->paginate(20)->withQueryString());
    }

    private function authorizeAdmin(Request $request): void
    {
        $user = $request->user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Akses Admin ditolak.');
        }
    }
}