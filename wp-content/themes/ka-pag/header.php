<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/assets/img/favicon.ico" type="image/x-icon">
    <title>Главная</title>
    <?php wp_head(); ?>
  </head>
  <body>
    <div class="overlay"></div>
    <div class="modal" id="modal">
      <div class="close-modal"><img src="<?php echo get_template_directory_uri(); ?>/assets/img/close.svg" alt=""></div>
      <h3>Оставьте ваш телефон<br> и мы перезвоним</h3>
      <form action="#">
        <label for="tel">Ваш телефон</label>
        <input type="tel" name="tel">
        <span>Нажимая кнопку вы соглашаетесь на обработку <a href="#">персональных данных</a> </span>
        <input type="submit" value="Отправить">
      </form>
    </div>
    <!-- ./modal -->
    <div class="mobile">
      <h3>Меню</h3>

      <?php wp_nav_menu( [ 
		    'theme_location'  => 'primary',
        'menu'  => 'Основное',
        'menu_class' => 'menu',
      ] ); ?>


      <a href="#" class="callback">Перезвоните мне</a>
      <div class="close"><img src="<?php echo get_template_directory_uri(); ?>/assets/img/close.svg" alt=""></div>
    </div>
    <!-- ./ mobile -->
    <header class="header">
      <div class="wrap header-contacts">
        <a href="<?php echo get_home_url(); ?>" class="logo"
          ><span>ПравоАрбитрГрупп</span>Коллегия адвокатов</a
        >
        <div class="contacts">

          <!-- email ---------->
          <?php 

          $email = get_field('email', 'option');

          if( $email ): 
            $link_url = $email['url'];
            $link_title = $email['title'];
            $link_target = $email['target'] ? $email['target'] : '_self';
            ?>
            <a href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a>
          <?php endif; ?>

            <!-- phone1 ---------->

            <?php 

            $phone1 = get_field('phone1', 'option');

            if( $phone1 ): 
              $link_url = $phone1['url'];
              $link_title = $phone1['title'];
              $link_target = $phone1['target'] ? $phone1['target'] : '_self';
              ?>
              <a href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a>
            <?php endif; ?>

            <!-- phone2 ---------->

            <?php 

            $phone2 = get_field('phone2', 'option');

            if( $phone2 ): 
              $link_url = $phone2['url'];
              $link_title = $phone2['title'];
              $link_target = $phone2['target'] ? $phone2['target'] : '_self';
              ?>
              <a href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a>
            <?php endif; ?>

          <a href="#" class="callback">Перезвоните мне</a>
          <div class="burger" id="burger"></div>
        </div>
      </div>
    </header>
      
      <?php wp_nav_menu( [ 
		    'theme_location'  => 'primary',
        'menu'  => 'Основное',
        'menu_class' => 'header-menu',
      ] ); ?>