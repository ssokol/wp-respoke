<?php
	/**
	 * Plugin Name: wp-respoke
	 * Plugin URI: http://docs.respoke.io/wordpress
	 * Description: Wordpress Plugin to connect with Respoke
	 * Version: 0.0.1
	 * Author: Steve Sokol
	 * Author URI: http://URI_Of_The_Plugin_Author
	 * Network: Optional. Whether the plugin can only be activated network wide. Example: true
	 * License: MIT
	 */
	 
	 
	if ( !defined('MY_PLUGIN_NAME') )
		define('MY_PLUGIN_NAME', trim(dirname(plugin_basename(__FILE__)), '/'));
	if ( !defined('MY_PLUGIN_PATH') )
		define ('MY_PLUGIN_PATH', WP_PLUGIN_URL . '/' . end(explode(DIRECTORY_SEPARATOR, dirname(__FILE__))));
	if ( !defined('MY_PLUGIN_DIR') )
		define('MY_PLUGIN_DIR', WP_PLUGIN_DIR . '/' . MY_PLUGIN_NAME);
	if ( !defined('MY_PLUGIN_VERSION_KEY') )
		define('MY_PLUGIN_VERSION_KEY', 'myplugin_version');
	if ( !defined('MY_PLUGIN_VERSION_NUM') )
		define('MY_PLUGIN_VERSION_NUM', '1.0.0');

	class wp_respoke_visitor_plugin extends WP_Widget {

		// constructor
		function wp_respoke_visitor_plugin() {
			parent::WP_Widget(false, $name = __('Respoke Visitor', 'wp_widget_plugin') );
		}

		// widget form creation
		function form($instance) {	
			// Check values
			if( $instance) {
				 $appId = esc_attr($instance['appId']);
				 $appSecret = esc_attr($instance['appSecret']);
				 $endpointId = esc_attr($instance['endpointId']);
				 $visitorRoleId = esc_attr($instance['visitorRoleId']);
				 $authorRoleId = esc_attr($instance['authorRoleId']);
				 $friendlyName = esc_attr($instance['friendlyName']);
			} else {
				 $appId = '';
				 $appSecret = '';
				 $endpointId = '';
				 $visitorRoleId = '';
				 $authorRoleId = '';
				 $friendlyName = '';
			}
			?>

			<p>
			<label for="<?php echo $this->get_field_id('appId'); ?>"><?php _e('Respoke App ID:', 'wp_widget_plugin'); ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id('appId'); ?>" name="<?php echo $this->get_field_name('appId'); ?>" type="text" value="<?php echo $appId; ?>" />
			</p>

			<p>
			<label for="<?php echo $this->get_field_id('appSecret'); ?>"><?php _e('Respoke App Secret:', 'wp_widget_plugin'); ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id('appSecret'); ?>" name="<?php echo $this->get_field_name('appSecret'); ?>" type="text" value="<?php echo $appSecret; ?>" />
			</p>

			<p>
			<label for="<?php echo $this->get_field_id('endpointId'); ?>"><?php _e('Telephone Number:', 'wp_widget_plugin'); ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id('endpointId'); ?>" name="<?php echo $this->get_field_name('endpointId'); ?>" type="text" value="<?php echo $endpointId; ?>" />
			</p>

			<p>
			<label for="<?php echo $this->get_field_id('friendlyName'); ?>"><?php _e('Display Name:', 'wp_widget_plugin'); ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id('friendlyName'); ?>" name="<?php echo $this->get_field_name('friendlyName'); ?>" type="text" value="<?php echo $friendlyName; ?>" />
			</p>

<!--
			<p>
			<label for="<?php echo $this->get_field_id('authorRoleId'); ?>"><?php _e('Author Role ID:', 'wp_widget_plugin'); ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id('authorRoleId'); ?>" name="<?php echo $this->get_field_name('authorRoleId'); ?>" type="text" value="<?php echo $authorRoleId; ?>" />
			</p>
-->

			<p>
			<label for="<?php echo $this->get_field_id('visitorRoleId'); ?>"><?php _e('Visitor Role ID:', 'wp_widget_plugin'); ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id('visitorRoleId'); ?>" name="<?php echo $this->get_field_name('visitorRoleId'); ?>" type="text" value="<?php echo $visitorRoleId; ?>" />
			</p>


			<?php
		}

		// widget update
		function update($new_instance, $old_instance) {
			$instance = $old_instance;
			// Fields
			$instance['appId'] = strip_tags($new_instance['appId']);
			$instance['appSecret'] = strip_tags($new_instance['appSecret']);
			$instance['endpointId'] = strip_tags($new_instance['endpointId']);
			$instance['visitorRoleId'] = strip_tags($new_instance['visitorRoleId']);
			$instance['authorRoleId'] = strip_tags($new_instance['authorRoleId']);
			$instance['friendlyName'] = strip_tags($new_instance['friendlyName']);
			return $instance;
		}

		// widget display
		function widget($args, $instance) {
		
			// display this widget only if the current user isn't the recipient
			$current_user = wp_get_current_user();

			if ($current_user->ID != 0) {
				if ($current_user->data->display_name == $instance['endpointId']) {
					return;
				}
			}
	
			// load several scripts and some CSS for use in the widget	
			wp_enqueue_script( 'jquery' );
			//wp_enqueue_script( 'respoke-client', 'https://cdn-st.respoke.io/respoke.min.js');
			wp_enqueue_script( 'respoke-client', 'https://cdn.respoke.io/respoke.min.js');
			wp_enqueue_script( 'respoke-visitor', MY_PLUGIN_PATH . '/js/visitor.js');
			wp_enqueue_script( 'jquery-custombox', MY_PLUGIN_PATH . '/js/custombox.min.js');
			wp_enqueue_script( 'respoke-md5', MY_PLUGIN_PATH . '/js/md5.js');
			wp_enqueue_style( 'respoke-visitor-css', MY_PLUGIN_PATH . '/css/respoke-visitor.css');
			wp_enqueue_style( 'jquery-custombox-css', MY_PLUGIN_PATH . '/css/custombox.min.css');

			// delete some items from the $instance array that we don't want to hand out
			unset($instance['authorRoleId']);
			unset($instance['visitorRoleId']);
			unset($instance['appSecret']);

			// pass the remaining instance data to javascript as 'wpData'
			wp_localize_script( 'respoke-visitor', 'wpData', $instance );
			
			extract( $args );
		
			// these are the widget options
			$appId = $instance['appId'];
			
		
			echo $before_widget;
			
			// Display the widget
			echo '<div class="widget-text wp_widget_plugin_box">';

			// Display the title
			echo $before_title . "Call Me" . $after_title;

			echo '<center>';
			echo '  <input type="button" id="respoke-visitor-chat" class="respoke-button respoke-disabled" disabled value="Call ' . $instance["friendlyName"] . ' Now" />';
			echo '  <input type="button" id="respoke-hangup-button" class="respoke-button" value="Hangup" />';
			echo '</center>';

			echo '</div>';
			echo '<hr />';
			echo '<div class="powered-by-respoke">Powered by <a target="_blank" href="http://www.respoke.io">Respoke</a></div>';
			?>
			<div id="respoke-pstn-dialog" class="respoke-overlay-dialog">
			  <div id="pstn-box">
  				<h3>Calling <?php print($instance["friendlyName"]); ?></h3>
	  			<p>We're placing a call from your browser to <?php print($instance["friendlyName"]); ?>. Please hang on while we connect you. You can hang up the call by clicking the 'Hangup' button below.</p>
	  		</div>
			</div>
			<?php
			echo $after_widget;
		}
	}

  function custom_rewrite_rule() {
    add_rewrite_rule('^respoke/token', MY_PLUGIN_PATH . '/api/token.php', 'top');
  }
    
  add_action('init', 'custom_rewrite_rule', 10, 0);

	// register widget
	add_action('widgets_init', create_function('', 'return register_widget("wp_respoke_visitor_plugin");'));

?>
