    <?php get_header(); ?>

      
    <!-- main-hero -------------------- -->
    <section class="main-hero">
      <div class="wrap">

        <h1><?php the_field('title'); ?></h1>
        <div class="subtitle"><?php the_field('subtitle'); ?></div>






        <!-- Фото коллегии ------------------------------ -->
        <?php $posts = get_posts ("category=5&orderby=date&numberposts=6"); ?> 
        <?php if ($posts) : ?>

          <div class="img-box">

          <?php foreach ($posts as $post) : setup_postdata ($post);  ?>

            

              <div class="image">
                <?php echo get_the_post_thumbnail() ?> 
              </div>

              <?php endforeach; ?>

            </div>

            <?php endif; wp_reset_query(); ?>






         <!-- Преимущества ------------------------------ -->
        <?php if( have_rows('advantages') ): ?>

          <ul class="advantages">

            <?php while( have_rows('advantages') ): the_row(); 

              // переменные
              $big = get_sub_field('big');
              $content = get_sub_field('content');

              ?>

              <li>
                <?php if( $content ): ?>
                  <span><?php echo $big; ?></span>
                <?php endif; ?>
                  <?php echo $content; ?>
              </li>

            <?php endwhile; ?>

            </ul>

        <?php endif; ?>

      </div>
    </section>
    <!-- ./main-hero-->
    <!-- main-services -------------------- -->
    <div class="main-services">
      <div class="wrap flex">
        <div class="wrapper">
         <!-- Услуги Для физических лиц ------------------------------ -->

         
         <h3>Для физических лиц</h3>

        <?php 
          wp_reset_postdata();  
          global $wp_query;  
          
          $wp_query = new WP_Query(array(
              'category_name' => 'uslugi-dlya-fizicheskih-licz',
              'post_status' => 'publish',
              'posts_per_page' => 20, 
              'orderby' => 'title', 
              'order' => 'ASC'
            ));
        ?>

         <ul>               

         <?php while( have_posts() ){ the_post();  ?>

            <li>

              <a href="<?php the_permalink(); ?>" class="title">
                <?php the_title(); ?>
              </a>

            </li>
            
            <?php }; ?>


          </ul>

          <?php 
          wp_reset_query(); 
          ?>






        </div>
        <!--./ wrapper-->

        <div class="wrapper">
         <!-- Услуги для юр лиц ------------------------------ -->
  
         <h3>Для юридических лиц</h3>

        <?php 
          wp_reset_postdata();  
          global $wp_query;  
          
          $wp_query = new WP_Query(array(
              'category_name' => 'uslugi-dlya-yuridicheskih-licz',
              'post_status' => 'publish',
              'posts_per_page' => 20, 
              'orderby' => 'title', 
              'order' => 'ASC'
            ));
        ?>

         <ul>               

         <?php while( have_posts() ){ the_post();  ?>

            <li>

              <a href="<?php the_permalink(); ?>" class="title">
                <?php the_title(); ?>
              </a>

            </li>
            
            <?php }; ?>


          </ul>

          <?php 
          wp_reset_query(); 
          ?>



        </div>
        <!--./ wrapper-->
      </div>
      <!--./ wrap-->
    </div>
    <!--./ main-services-->
    
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
    
    <!-- Отзывы ------------------------------ -->
    <section class="testimonials">
      <div class="wrap">
      
         <?php if( have_rows('slider') ): ?>

          <div class="slider" id="slider">

            <?php while( have_rows('slider') ): the_row(); 

              // переменные
              $text = get_sub_field('text');

              ?>

              <p class="text"><?php echo $text; ?></p>

            <?php endwhile; ?>

            </div>

          <?php endif; ?>
        <!-- ./ slider -->
        <div class="buttons">
          <button type="button" class="prev">
            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/arrow-left.svg" alt="" />
          </button>
          <button type="button" class="next">
            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/arrow-right.svg" alt="" />
          </button>
        </div>
      </div>
    </section>
    <!--./ testimonials-->

    <!-- Сертификаты, дипломы ------------------------------ -->
    <section class="cetificates">
      <div class="wrap">
        <h2>Сертификаты, дипломы</h2>

        <?php if( have_rows('cetificates') ): ?>

          <div class="slider-certificates">

            <?php while( have_rows('cetificates') ): the_row(); 

              // переменные
              $cetificateimage = get_sub_field('cetificateimage');
              $cetificatelink = get_sub_field('cetificatelink');

              ?>

                <?php if( $cetificatelink ): ?>
                  <a href="<?php echo $cetificateimage['url']; ?>" class="lightgallery">
                <?php endif; ?>

                  <img src="<?php echo $cetificateimage['url']; ?>" alt="<?php echo $cetificateimage['alt'] ?>" />

                <?php if( $cetificatelink ): ?>
                  </a>
                <?php endif; ?>

            <?php endwhile; ?>

            </div>
            <!--./ slider-certificates -->

            <?php endif; ?>


        <div class="buttons">
          <button type="button" class="prev2">
            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/arrow-left.svg" alt="" />
          </button>
          <button type="button" class="next2">
            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/arrow-right.svg" alt="" />
          </button>
        </div>
      </div>
    </section>



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

    <!-- Новости и статьи ------------------------------ -->

    <section class="news">
      <div class="wrap">
        <h2>Новости и статьи</h2>



        
        <?php $posts = get_posts ("category=6,7&orderby=date&numberposts=6"); ?> 
        <?php if ($posts) : ?>

          <div class="posts">

        <?php foreach ($posts as $post) : setup_postdata ($post); ?>


            <a href="<?php the_permalink(); ?>" class="post">
            
              <span><?php echo get_the_date(); ?> / <?php $cat = get_the_category(); echo $cat[0]->cat_name; ?></span>

              <div class="title">
                <?php the_title(); ?>
              </div>
              
              <span>Читать далее</span>
            </a>

        <?php endforeach; ?>
        
          </div>
            <!--./ posts-->

        <?php endif; wp_reset_query(); ?>
        <!--./posts-->
        <a href="<?php echo get_home_url(); ?>/news-posts/" class="read-more">Смотреть все публикации</a>
      </div>
    </section>
    <!--./ news-->



    <section class="questions">
      <div class="wrap">
        <h2>Часто задаваемые вопросы</h2>


        <?php if( have_rows('questions') ): ?>

          <div>

          <?php while( have_rows('questions') ): the_row(); 

            // переменные
            $button = get_sub_field('button');
            $panel = get_sub_field('panel');

            ?>

              <?php if( $button ): ?>
                <button class="accordion">
                  <?php echo $button; ?>
                </button>
              <?php endif; ?>

              <?php if( $panel ): ?>
                <div class="panel">
                  <p><?php echo $panel; ?></p>
                </div>
                <!--./ panel -->
              <?php endif; ?>                


          <?php endwhile; ?>

          </div>

          <?php endif; ?>
      </div>
    </section>


    <section class="appointment">
      <div class="wrap">
        <h3 style="text-align: center; margin-bottom: 20px;">Записаться на консультацию</h3>   

        <?php the_field('form', 'option'); ?>

      </div>
    </section>
    <?php get_footer(); ?>