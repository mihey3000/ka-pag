<?php 


get_header(); ?>
    <!-- practise-hero -------------------- -->
    <section class="practise-hero">
      <div class="wrap">




        <?php while( have_posts() ){ the_post();  ?>

         

              <div class="post-type">
                <?php the_tags( '', ' > '); ?>
              </div>

              <h2 style="text-align:left;"><?php the_title(); ?></h2>                
            

              <p style="margin-bottom: 20px;">Автор статьи: <?php the_author(); ?> / Опубликовано: <?php the_date(); ?></p>
              
              <p><?php the_content(); ?></p>


          <?php }; ?>

                






      </div>
    </section>
    <!-- ./practise-hero-->


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