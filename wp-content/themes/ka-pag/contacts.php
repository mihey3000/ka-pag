<?php 

/**
 * Template Name: contacts
 * Template Post Type: page
 * 
 */

get_header(); ?>
    <!-- contacts-hero -------------------- -->
    <section class="contacts-hero">
      <div class="wrap">


        <h2>Контакты</h2>


        <div class="address">
          
          <!-- phone ---------->

          <?php 

          $phone1 = get_field('phone1', 'option');

          if( $phone1 ): 
            $link_url = $phone1['url'];
            $link_title = $phone1['title'];
            $link_target = $phone1['target'] ? $phone1['target'] : '_self';
            ?>
            <h3><a href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a></h3>
          <?php endif; ?>
          
          <!-- email ---------->
          <?php 

            $email = get_field('email', 'option');

            if( $email ): 
              $link_url = $email['url'];
              $link_title = $email['title'];
              $link_target = $email['target'] ? $email['target'] : '_self';
              ?>
            <h3><a href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a></h3>
            <?php endif; ?>
            
            <h3><?php the_field('address', 'option'); ?></h3>

          </div>
          <!--./ address -->


        <div class="map-box">
          <div class="form-wrap">     
            <h3 style="text-align: center; margin-bottom: 20px;">Записаться на консультацию</h3>      

            <?php the_field('form', 'option'); ?>
            
          </div>
          <div class="map">


            <?php the_field('map'); ?>
            
          </div>

        </div>
      </div>
    </section>
    <!-- ./contacts-hero-->
    <?php get_footer(); ?>
