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

            <?php if ($profile_specialization) : ?>
              <span>
            <?php endif; ?>

                <?php echo $profile_specialization; ?>

            <?php if ($profile_specialization) : ?>
              </span>
            <?php endif; ?>

            <h2><?php the_title();?></h2>
            <?php the_field('profile-text');?>
          </div>



        </div>
      <!--./ box -->


      </div>
      <!--./ wrap -->
    </section>
    <!-- ./profile-hero-->



    
      <!-- Адвокаты ------------------------------ -->
      <section class="advocats">
      <div class="wrap">
        <h2>Адвокаты</h2>



        <?php $posts = get_posts (array(
                      'numberposts' => 6,
                      'category'    => 5,
                      'orderby'     => 'date',
                      'order'       => 'ASC'
                    )); ?> 
        <?php if ($posts) : ?>

          <div class="box">

        <?php foreach ($posts as $post) : setup_postdata ($post); 
        
        ?>
         <div class="item">

           
           
           <?php echo get_the_post_thumbnail() ?> 

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