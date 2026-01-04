<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
        User::factory()->create([
            'name' => 'John',
            'email' => 'member@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'member',
        ]);
        User::factory()->create([
            'name' => 'Sarah ',
            'email' => 'sarah@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'member',
        ]);
        User::factory()->create([
            'name' => 'Alice',
            'email' => 'user@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);
        User::factory()->create([
            'name' => 'Bob',
            'email' => 'bob@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);
    }
}
