<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::table('cart_items', function (Blueprint $table) {
            // 1. Buat index unik baru terlebih dahulu
            $table->unique(['cart_id', 'product_id', 'size'], 'cart_items_cart_product_size_unique');

            // 2. Hapus index unik lama
            $table->dropUnique('cart_items_cart_id_product_id_unique');
        });

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::table('cart_items', function (Blueprint $table) {
            $table->unique(['cart_id', 'product_id'], 'cart_items_cart_id_product_id_unique');
            $table->dropUnique('cart_items_cart_product_size_unique');
        });

        Schema::enableForeignKeyConstraints();
    }
};