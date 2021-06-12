<?php 

/**
 * Template Name: profile
 * Template Post Type: post
 * 
 */

get_header(); ?>
    <!-- profile-hero -------------------- -->
    <section class="profile-hero">
      <div class="wrap">

        <div class="box">

          <div>
              <?php echo get_the_post_thumbnail() ?> 
          </div>


          <div class="text">
            <?php 
              $profile_specialization = get_field('profile-specialization'); 
            ?>
            <span><?php echo $profile_specialization; ?></span>
            <h2><?php the_title();?></h2>
            <?php the_field('profile-text');?>
          </div>

        </div>


      </div>
      <!--./ wrap -->
    </section>
    <!-- ./profile-hero-->



    <section class="education">
      <div class="wrap">

        <div class="image">
          

        <?php 

          $verification_image = get_field('verification-image');

          if( !empty($verification_image) ): ?>

            <img src="<?php echo $verification_image['url']; ?>" alt="<?php echo $verification_image['alt']; ?>" />

          <?php endif; ?>
        </div>

        <div class="text">
          <h3>Образование</h3>
          <p><?php the_field('profile-education');?>
          </p>
          <h3>Специализация</h3>

          <ul class="specialization">
            <?php


            // проверяем есть ли в повторителе данные
            if( have_rows('specialization-list') ):

              // перебираем данные
                while ( have_rows('specialization-list') ) : the_row();?>
                    <li><?php the_sub_field('specialization-item');?></li>
                <?php endwhile;

            else :

                // вложенных полей не найдено

            endif;?>
          </ul>

          <h3>Контакты</h3>
          <div class="contacts">

            <ul class="phone">

              <?php 
                // основной телефон
                $profile_phone = get_field('profile-phone');

                if( $profile_phone ): 
                  $link_url = $profile_phone['url'];
                  $link_title = $profile_phone['title'];
                  $link_target = $profile_phone['target'] ? $profile_phone['target'] : '_self';
                  ?>
                  <li><a class="button" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a></li>
              <?php endif; ?>

              <?php 
                // дополнительный телефон
                $profile_phone2 = get_field('profile-phone2');

                if( $profile_phone2 ): 
                  $link_url = $profile_phone2['url'];
                  $link_title = $profile_phone2['title'];
                  $link_target = $profile_phone2['target'] ? $profile_phone2['target'] : '_self';
                  ?>
                  <li><a class="button" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a></li>
              <?php endif; ?>

              <?php 
                // email
                $profile_email = get_field('profile-email');

                if( $profile_email ): 
                  $link_url = $profile_email['url'];
                  $link_title = $profile_email['title'];
                  $link_target = $profile_email['target'] ? $profile_email['target'] : '_self';
                  ?>
                  <li><a class="button" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a></li>
              <?php endif; ?>
            </ul>



            <?php if( have_rows('profile-social') ): ?>

              <ul class="social">

              <?php while( have_rows('profile-social') ): the_row(); 

                // соцсети
                $profile_social_image = get_sub_field('profile-social-image');
                $profile_link = get_sub_field('social-link');

                ?>

                <li>

                  <?php if( $profile_link ): ?>
                    <a href="<?php echo $profile_link; ?>">
                  <?php endif; ?>

                    <img src="<?php echo $profile_social_image['url']; ?>" alt="<?php echo $profile_social_image['alt'] ?>" />

                  <?php if( $profile_link ): ?>
                    </a>
                  <?php endif; ?>

                </li>

              <?php endwhile; ?>

              </ul>

              <?php endif; ?>


          </div>
          <!-- ./contacts -->
        </div>
      </div>
    </section>
    <!-- ./education-->


    
      <!-- Адвокаты ------------------------------ -->
      <section class="advocats">
      <div class="wrap">
        <h2>Адвокаты</h2>



        <?php $posts = get_posts ("category=5&orderby=date&numberposts=6"); ?> 
        <?php if ($posts) : ?>

          <div class="box">

        <?php foreach ($posts as $post) : setup_postdata ($post); 
        
        ?>
         <div class="item">

           
           
           <?php echo get_the_post_thumbnail() ?> 
            
              <?php if( $profile_specialization ): ?>
                <div class="specialization">
                  <?php echo $profile_specialization; ?>
                </div>
              <?php endif; ?>

            <div class="name">
              <?php the_title(); ?>
            </div>

            <a href="<?php the_permalink(); ?>" class="btn"> Открыть профиль</a>

          </div>
          <!--./ item -->

        <?php endforeach; ?>
        
          </div>
            <!--./ box-->

        <?php endif; wp_reset_query(); ?>
        
          </div>
          <!--./ wrap-->
        </section>
        <!--./ advocats-->




        <!-- Практика ------------------------------ -->
        <section class="practise">
      <div class="wrap">
        <h2>Практика</h2>


        <?php $posts = get_posts ("category=4&orderby=date&numberposts=6"); ?> 
        <?php if ($posts) : ?>

          <div class="posts">

        <?php foreach ($posts as $post) : setup_postdata ($post); ?>


            <a href="<?php the_permalink(); ?>" class="post">

              <div class="title">
                <?php the_title(); ?>
              </div>
              
              <span>Читать далее</span>
            </a>

        <?php endforeach; ?>
        
          </div>
            <!--./ posts-->

        <?php endif; wp_reset_query(); ?>
            
        <a href="<?php echo get_home_url(); ?>/practice/" class="read-more">Смотреть все публикации</a>
      </div>
      <!--./ wrap-->
    </section>
    <!--./ practise-->





    <!-- Цены ------------------------------ -->

    <section class="prices">
      <div class="wrap">
        <h2>Цены</h2>

        <?php if( have_rows('prices', 'option') ): ?>

        <div>

        <?php while( have_rows('prices', 'option') ): the_row(); 

          // переменные
          $text = get_sub_field('text', 'option');
          $price = get_sub_field('price', 'option');

          ?>

            <div class="item">

              <?php if( $text ): ?>
                <div class="text"><?php echo $text; ?></div>
              <?php endif; ?>

              <?php if( $price ): ?>
              <div class="price"><?php echo $price; ?></div>
              <?php endif; ?>

            </div>
            <!--./ item -->

        <?php endwhile; ?>

        </div>
        <!-- ./prices -->

        <?php endif; ?>


        <?php 

        $readmoreprices = get_field('readmoreprices', 'option');

        if( $readmoreprices ): 
          $link_url = $readmoreprices['url'];
          $link_title = $readmoreprices['title'];
          $link_target = $readmoreprices['target'] ? $readmoreprices['target'] : '_self';
          ?>          
          <a href="<?php echo esc_url($link_url); ?>" class="read-more" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a>
        <?php endif; ?>


      </div>
    </section>
    <!--./ prices-->


    <section class="appointment">
      <div class="wrap">
        <h3 style="text-align: center; margin-bottom: 20px;">Записаться на консультацию</h3>   

        <?php the_field('form', 'option'); ?>

      </div>
    </section>

    <?php get_footer(); ?>