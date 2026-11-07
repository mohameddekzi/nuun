<?php
/**
 * Tureas block theme.
 *
 * @package Tureas
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'TUREAS_VERSION', '1.0.0.' . filemtime( __DIR__ . '/style.css' ) );

add_action( 'after_setup_theme', function () {
	add_theme_support( 'editor-styles' );
	add_editor_style( 'style.css' );
	add_theme_support( 'responsive-embeds' );
} );

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'tureas', get_stylesheet_uri(), array(), TUREAS_VERSION );
	wp_enqueue_script( 'tureas', get_theme_file_uri( 'assets/js/site.js' ), array(), TUREAS_VERSION, array( 'strategy' => 'defer', 'in_footer' => true ) );
} );

// Mark the document early so reveal animations never flash.
add_action( 'wp_head', function () {
	echo "<script>document.documentElement.classList.add('tu-js');</script>\n";
}, 1 );

// Pattern category so Tureas sections are easy to find in the inserter.
add_action( 'init', function () {
	register_block_pattern_category( 'tureas', array( 'label' => __( 'Tureas Sections', 'tureas' ) ) );
	register_block_style( 'core/button', array( 'name' => 'tu-ghost', 'label' => __( 'Ghost (white outline)', 'tureas' ) ) );
	register_block_style( 'core/button', array( 'name' => 'tu-white', 'label' => __( 'White', 'tureas' ) ) );
} );
