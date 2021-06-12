    <footer class="footer">
      <div class="wrap">
        
        <?php wp_nav_menu( [ 
          'theme_location'  => 'primary',
          'menu'  => 'Основное',
          'menu_class' => 'footer-menu',
        ] ); ?>



        <div class="details">
          <div>
            <div class="agreement">

              <!-- Политика конфиденциальности ---------->
              <?php 

              $politics = get_field('politics', 'option');

              if( $politics ): 
                $link_url = $politics['url'];
                $link_title = $politics['title'];
                $link_target = $politics['target'] ? $politics['target'] : '_self';
                ?>
                <a href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a>
              <?php endif; ?>

              <!-- Пользовательское соглашение ---------->
              <?php 

              $agreement = get_field('agreement', 'option');

              if( $agreement ): 
                $link_url = $agreement['url'];
                $link_title = $agreement['title'];
                $link_target = $agreement['target'] ? $agreement['target'] : '_self';
                ?>
                <a href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a>
              <?php endif; ?>

            </div>
            <div class="copyrights">
              <div>© <?php echo date('Y'); ?> Коллегия адвокатов «ПравоАрбитрГрупп»</div>
              <a href="https://vk.com/id25829595" target="_blank">Разработка сайта: Дронов Михаил</a>
            </div>          
          </div>
  
          <div class="contacts">
            <div>

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
            </div>
            <div class="address"><?php the_field('address', 'option'); ?></div>
          </div>

        </div>

      </div>
    </footer>
    <?php wp_footer(); ?>
    
  </body>
</html>
