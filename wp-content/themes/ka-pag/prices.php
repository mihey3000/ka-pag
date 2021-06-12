<?php 

/**
 * Template Name: prices
 * Template Post Type: page
 * 
 */

get_header(); ?>
    <!-- main-hero -------------------- -->
    <section class="prices-hero">
      <div class="wrap">



        <!-- Услуги и цены -------------------- -->
        <h2>Услуги и цены</h2>
        <div>
          <a href="#entity" class="read-more">Для юридических лиц</a>
          <a href="#individual" class="read-more">Для физических лиц</a>          
        </div>
        
        
        <!-- Для юридических лиц -------------------- -->
        <h3 id="entity">Для юридических лиц</h3>
        <div class="prices">


        <?php if( have_rows('entity') ): ?>

          <div class="prices">

          <?php while( have_rows('entity') ): the_row(); 

            // переменные
            $text = get_sub_field('text');
            $price = get_sub_field('price');

            ?>

              <div class="item">

                <?php if( $text ): ?>
                  <div class="text"><?php echo $text; ?></div>
                <?php endif; ?>


                <?php if( $price ): ?>
                  <div class="price"><?php echo $price; ?></div>
                <?php endif; ?>

            </div>

          <?php endwhile; ?>

          </div>
          <!-- ./prices -->

          <?php endif; ?>


        <!-- Для физических лиц -------------------- -->
        <h3 id="individual">Для физических лиц</h3>
        
        <?php if( have_rows('individual') ): ?>

          <div class="prices">

          <?php while( have_rows('individual') ): the_row(); 

            // переменные
            $text = get_sub_field('text');
            $price = get_sub_field('price');

            ?>

              <div class="item">

                <?php if( $text ): ?>
                  <div class="text"><?php echo $text; ?></div>
                <?php endif; ?>


                <?php if( $price ): ?>
                  <div class="price"><?php echo $price; ?></div>
                <?php endif; ?>

            </div>

          <?php endwhile; ?>

          </div>
          <!-- ./prices -->

          <?php endif; ?>

        </div>
    </section>
    <!-- ./prices-hero-->



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


    <section class="appointment">
      <div class="wrap">
        <h3 style="text-align: center; margin-bottom: 20px;">Записаться на консультацию</h3>

        <?php the_field('form', 'option'); ?>

      </div>
    </section>
    <?php get_footer(); ?>