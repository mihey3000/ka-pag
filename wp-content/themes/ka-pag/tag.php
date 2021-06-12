
<?php 

get_header(); 
$tag = get_query_var('tag');

?>
<!-- practise-hero -------------------- -->
<section class="practise-hero">
  <div class="wrap">



        <h2>Практика</h2>



        <a href="#" class="category-trigger">Показать/Скрыть категории</a>

        <div class="box">  
        <div class="posts">


            <?php
                
                global $post;
                $args = array( 'numberposts' => -1, 'tag'=> $tag, 'order' => 'ASC');
                $myposts = get_posts( $args );
                
                if ($myposts){
                foreach( $myposts as $post ) : setup_postdata($post); ?>

                    <div class="post">                  
                        
                        <div class="post-type">
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
                <?php endforeach; }
            ?>
             </div>
            <!--./ posts-->


                <div class="sidebar" id="sidebar">
            <div class="category">
              <h3>Категории</h3>

              <?php
              $post_ids = get_objects_in_term( 4, 'category' );
              if ( ! empty( $post_ids ) && ! is_wp_error( $post_ids ) ) {
                $tags = wp_get_object_terms( $post_ids, 'post_tag' );
                if ( ! empty( $tags ) && ! is_wp_error( $tags ) ) {
              ?>
                  <ul class="category-list">
                    <li><a href="<?php echo get_home_url(); ?>/practice/">Показать все</a></li>
                    <?php foreach( $tags as $tag ) { ?>
                      <li><a href="<?php echo get_term_link( $tag, 'post_tag' ); ?>"><?php echo $tag->name; ?></a></li>
                    <?php } ?>
                  </ul>
                <?php } ?>
              <?php } ?>

            </div>
            <!-- ./category -->




            <div class="form-wrap">
              <h3>Записаться на консультацию</h3>
                <?php the_field('form', 'option'); ?>
            </div>
          </div>
          <!-- ./sildebar -->

        </div>
        <!-- ./box -->


      </div>
    </section>
    <!-- ./practise-hero-->
    <?php get_footer(); ?>
