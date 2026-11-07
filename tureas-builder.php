<?php
/**
 * Temporary Tureas page builder (serializes native blocks in the browser). Delete after use.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

const TUREAS_BUILD_TOKEN = 'a29dadd6e13c46d0159c81da037a41b4';

add_action( 'rest_api_init', function () {
	register_rest_route( 'tureas/v1', '/save', array(
		'methods'             => 'POST',
		'permission_callback' => function ( $r ) { return hash_equals( TUREAS_BUILD_TOKEN, (string) $r->get_header( 'x-tureas-token' ) ); },
		'callback'            => function ( $r ) {
			wp_set_current_user( 1 );
			kses_remove_filters();
			$body = $r->get_json_params();
			$out  = array();
			foreach ( (array) ( $body['pages'] ?? array() ) as $id => $content ) {
				$res = wp_update_post( array( 'ID' => (int) $id, 'post_content' => wp_slash( $content ) ), true );
				$out[ $id ] = is_wp_error( $res ) ? $res->get_error_message() : strlen( get_post( $id )->post_content );
			}
			update_option( 'tureas_build_report', $body['report'] ?? array(), false );
			if ( ! empty( $body['parts'] ) ) { update_option( 'tureas_parts_serialized', $body['parts'], false ); }
			return $out;
		},
	) );
} );

add_action( 'template_redirect', function () {
	if ( ! isset( $_GET['tureas_build'] ) || ! hash_equals( TUREAS_BUILD_TOKEN, (string) $_GET['tureas_build'] ) ) { return; }
	$sha   = preg_replace( '/[^a-f0-9]/', '', (string) ( $_GET['sha'] ?? '' ) );
	$resp  = wp_remote_get( 'https://raw.githubusercontent.com/mohameddekzi/nuun/' . $sha . '/specs.json', array( 'timeout' => 30 ) );
	$specs = wp_remote_retrieve_body( $resp );
	$ids   = get_option( 'tureas_ids' );
	$map   = array( 'home' => $ids['home'], 'about' => $ids['about'], 'services' => $ids['services'], 'leadership' => $ids['leadership'], 'contact' => $ids['contact'], 'proposal' => $ids['request-a-proposal'] );
	$parts = array();
	$dir   = get_theme_root() . '/tureas/parts/';
	foreach ( array( 'header', 'footer', 'cta' ) as $p ) { $parts[ $p ] = file_exists( $dir . $p . '.html' ) ? file_get_contents( $dir . $p . '.html' ) : ''; }
	wp_enqueue_script( 'wp-blocks' );
	wp_enqueue_script( 'wp-block-library' );
	wp_enqueue_script( 'wp-format-library' );
	header( 'Content-Type: text/html; charset=utf-8' );
	echo '<!doctype html><html><head><meta charset="utf-8"><title>Tureas builder</title>';
	wp_print_scripts();
	echo '</head><body><pre id="log">building…</pre>';
	echo '<script>window.TU_SPECS=' . ( $specs ? $specs : 'null' ) . ';window.TU_MAP=' . wp_json_encode( $map ) . ';window.TU_PARTS=' . wp_json_encode( $parts ) . ';window.TU_TOKEN=' . wp_json_encode( TUREAS_BUILD_TOKEN ) . ';window.TU_REST=' . wp_json_encode( rest_url( 'tureas/v1/save' ) ) . ';</script>';
	?>
<script>
(async function () {
	const log = (m) => { document.getElementById('log').textContent += '\n' + m; };
	try {
		const { blocks, blockLibrary } = wp;
		if (blockLibrary && blockLibrary.registerCoreBlocks) blockLibrary.registerCoreBlocks();
		if (!blocks.getBlockType('wpforms/form-selector')) {
			blocks.registerBlockType('wpforms/form-selector', { title: 'WPForms', category: 'widgets', attributes: { formId: { type: 'string' }, displayTitle: { type: 'boolean' }, displayDesc: { type: 'boolean' } }, edit: () => null, save: () => null });
		}
		const build = (s) => blocks.createBlock(s.name, s.attributes || {}, (s.innerBlocks || []).map(build));
		const report = {};
		const pages = {};
		for (const key of Object.keys(window.TU_SPECS || {})) {
			const list = window.TU_SPECS[key].map(build);
			const html = blocks.serialize(list);
			// round-trip validation
			const parsed = blocks.parse(html);
			const bad = [];
			const walk = (bs) => bs.forEach((b) => { if (b.isValid === false) bad.push(b.name); walk(b.innerBlocks || []); });
			walk(parsed);
			report[key] = { len: html.length, invalid: bad };
			pages[window.TU_MAP[key]] = html;
		}
		const parts = {};
		for (const [k, src] of Object.entries(window.TU_PARTS || {})) {
			const parsed = blocks.parse(src);
			const bad = [];
			const walk = (bs) => bs.forEach((b) => { if (b.isValid === false) bad.push(b.name + ':' + (b.validationIssues || []).map(i => String(i.args && i.args.slice(1).join(' | ')).slice(0, 300)).join(' // ')); walk(b.innerBlocks || []); });
			walk(parsed);
			report['part_' + k] = { invalid: bad };
			parts[k] = blocks.serialize(parsed);
		}
		const res = await fetch(window.TU_REST, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Tureas-Token': window.TU_TOKEN }, body: JSON.stringify({ pages, report, parts }) });
		const j = await res.json();
		log('saved: ' + JSON.stringify(j));
		log('report: ' + JSON.stringify(report));
		window.TU_DONE = { saved: j, report };
	} catch (e) { log('ERROR ' + e.message + '\n' + e.stack); window.TU_DONE = { error: e.message }; }
})();
</script>
	<?php
	echo '</body></html>';
	exit;
} );
