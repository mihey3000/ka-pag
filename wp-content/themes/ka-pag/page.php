<?php 
/**
 * Template Name: page
 * Template Post Type: page
 * 
 */
get_header(); ?>
<!-- page-template -------------------- -->
<section class="page-template">
  <div class="wrap">

    <?php while( have_posts() ){ the_post();  ?>      

          <h1><?php the_title(); ?></h1>       
          
          <p><?php the_content(); ?></p>

      <?php }; ?>

  </div> 
  </section>      

<?php get_footer(); ?>