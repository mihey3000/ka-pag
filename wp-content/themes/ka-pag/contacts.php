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


        <?php if( have_rows('contacts') ): ?>

          <div class="box">

            <?php while( have_rows('contacts') ): the_row(); 

              // переменные
              $specialization = get_sub_field('specialization');
              $name = get_sub_field('name');
              $phone = get_sub_field('phone');
              $email = get_sub_field('email');

              ?>

              <div class="item">

                <?php
                //  специализация
                if( $specialization ): ?>
                  <div class="specialization"><?php echo $specialization; ?></div>
                <?php endif; ?>

                <?php
                //  имя
                if( $name ): ?>
                  <div class="name"><?php echo $name; ?></div>
                <?php endif; ?>

                <?php 
                //  телефон

                if( $phone ): 
                  $link_url = $phone['url'];
                  $link_title = $phone['title'];
                  $link_target = $phone['target'] ? $phone['target'] : '_self';
                  ?>
                  <a class="phone" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a>
                <?php endif; ?>

                <?php 
                //  email

                if( $email ): 
                  $link_url = $email['url'];
                  $link_title = $email['title'];
                  $link_target = $email['target'] ? $email['target'] : '_self';
                  ?>
                  <a class="email" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a>
                <?php endif; ?>

              </div>

            <?php endwhile; ?>

          </div>
        <!-- ./box -->

        <?php endif; ?>



        <div class="map-box">
          <div class="form-wrap">     
            <h3 style="text-align: center; margin-bottom: 20px;">Записаться на консультацию</h3>      

            <?php the_field('form', 'option'); ?>
            
          </div>
          <div class="map">
            <div class="address"> Адрес офиса: <?php the_field('address', 'option'); ?></div>
            <?php the_field('map'); ?>
            
          </div>

        </div>
      </div>
    </section>
    <!-- ./contacts-hero-->
    <?php get_footer(); ?>
