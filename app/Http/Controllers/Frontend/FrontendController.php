<?php
// app/Http/Controllers/Frontend/FrontendController.php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class FrontendController extends Controller
{
    /**
     * Display the home page
     */
    public function home(): Response
    {
        return Inertia::render('Frontend/Home');
    }

    /**
     * Display the about page
     */
    public function about(): Response
    {
        return Inertia::render('Frontend/About');
    }

    /**
     * Display the projects & programs page
     */
    public function projectsPrograms(): Response
    {
        return Inertia::render('Frontend/ProjectsPrograms');
    }

    /**
     * Display the workplace area page
     */
    public function workplaceArea(): Response
    {
        return Inertia::render('Frontend/WorkplaceArea');
    }

    /**
     * Display the posts page
     */
    public function posts(): Response
    {
        return Inertia::render('Frontend/Posts');
    }

    /**
     * Display a single post
     */
    public function showPost(string $slug): Response
    {
        return Inertia::render('Frontend/PostShow', [
            'slug' => $slug,
        ]);
    }

    /**
     * Display the media page
     */
    public function media(): Response
    {
        return Inertia::render('Frontend/Media');
    }

    /**
     * Display the get involved page
     */
    public function getInvolved(): Response
    {
        return Inertia::render('Frontend/GetInvolved');
    }

    /**
     * Display the jobs page (frontend public jobs listing)
     */
    public function jobs(): Response
    {
        return Inertia::render('Frontend/Jobs');
    }

    /**
     * Display a single job (frontend)
     */
    public function showJob(string $slug): Response
    {
        return Inertia::render('Frontend/JobShow', [
            'slug' => $slug,
        ]);
    }
}
