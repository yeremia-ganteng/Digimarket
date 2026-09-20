<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Akun Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin Digimarket',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]
        );

        // 2. Buat Akun Seller
        $seller = User::firstOrCreate(
            ['email' => 'seller@example.com'],
            [
                'name' => 'Seller Store',
                'password' => bcrypt('password'),
                'role' => 'seller',
            ]
        );

        // 3. Buat Akun Buyer
        $buyer = User::firstOrCreate(
            ['email' => 'buyer@example.com'],
            [
                'name' => 'Buyer One',
                'password' => bcrypt('password'),
                'role' => 'buyer',
            ]
        );
    }
}