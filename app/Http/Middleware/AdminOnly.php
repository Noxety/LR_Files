<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    
    public function handle(Request $request, Closure $next): Response
    {
        if (auth() && auth()->user()->role === 'admin') {
            return $next($request);
        }

        abort(403, 'You have not permission to access this page.');
    }
}
