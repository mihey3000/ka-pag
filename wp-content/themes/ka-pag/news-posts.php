<?php 

/**
 * Template Name: news-posts
 * Template Post Type: page
 * 
 */

get_header(); ?>
    <!-- practise-hero -------------------- -->
    <section class="practise-hero">
      <div class="wrap">




        <h2>Новости и статьи</h2>
      

        <?php 
          wp_reset_postdata();  
          global $wp_query;  
          
          $wp_query = new WP_Query(array(
              'category_name' => 'novost, statya',
              'post_status' => 'publish',
              'posts_per_page' => 20, 
              'orderby' => 'title', 
              'order' => 'ASC', 
              'paged' => get_query_var('paged') ?: 1 // страница пагинации
            ));
        ?>

          <div class="posts news-posts">

            <?php while( have_posts() ){ the_post();  ?>

              <div class="post">                  
                
                <div class="post-type">
                <span><?php echo get_the_date(); ?> / <?php $cat = get_the_category(); echo $cat[0]->cat_name; ?></span>
                  <?php the_tags( '', ' > '); ?>
                </div>

                <a href="<?php the_permalink(); ?>" class="title">
                  <?php the_title(); ?>
                </a>

                <div class="excerpt">
                  <?php the_excerpt(); ?>
                </div> 

              </div>
              <!-- ./ post -->
              <?php }; ?>

              
              <?php wp_pagenavi(); ?>           

        
          </div>
            <!--./ posts-->

        <?php 
          wp_reset_query(); 
          ?>




      </div>
    </section>
    <!-- ./practise-hero-->
    <?php get_footer(); ?>