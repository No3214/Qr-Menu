-- Add sample video URLs for demo restaurant
-- Using Pexels free stock videos (direct MP4 links)

DO $$
DECLARE
  rest_id uuid;
BEGIN
  -- Get demo restaurant
  SELECT id INTO rest_id FROM restaurants WHERE slug = 'kozbeyli-konagi' LIMIT 1;

  IF rest_id IS NOT NULL THEN
    -- Update restaurant with hero video
    UPDATE restaurants
    SET
      video_url = 'https://videos.pexels.com/video-files/3252535/3252535-sd_640_360_25fps.mp4',
      cover_image_url = 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
    WHERE id = rest_id;

    -- Update some menu items with video URLs
    UPDATE menu_items
    SET video_url = 'https://videos.pexels.com/video-files/4253729/4253729-sd_640_360_25fps.mp4'
    WHERE restaurant_id = rest_id
    AND name = 'Truffle Arugula'
    LIMIT 1;

    UPDATE menu_items
    SET video_url = 'https://videos.pexels.com/video-files/3298572/3298572-sd_640_360_25fps.mp4'
    WHERE restaurant_id = rest_id
    AND name = 'Margherita'
    LIMIT 1;

    UPDATE menu_items
    SET video_url = 'https://videos.pexels.com/video-files/4087556/4087556-sd_506_960_25fps.mp4'
    WHERE restaurant_id = rest_id
    AND name = 'Espresso Martini'
    LIMIT 1;

    -- Add sample images to categories
    UPDATE menu_categories
    SET image_url = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
    WHERE restaurant_id = rest_id AND name = 'Cold';

    UPDATE menu_categories
    SET image_url = 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=800'
    WHERE restaurant_id = rest_id AND name = 'Hot';

    UPDATE menu_categories
    SET image_url = 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=800'
    WHERE restaurant_id = rest_id AND name = 'Pizzaaa';

    UPDATE menu_categories
    SET image_url = 'https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?auto=compress&cs=tinysrgb&w=800'
    WHERE restaurant_id = rest_id AND name = 'Main Course';

    UPDATE menu_categories
    SET image_url = 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800'
    WHERE restaurant_id = rest_id AND name = 'Brunch';

    UPDATE menu_categories
    SET image_url = 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800'
    WHERE restaurant_id = rest_id AND name = 'Sweet';

    UPDATE menu_categories
    SET image_url = 'https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=800'
    WHERE restaurant_id = rest_id AND name = 'Cocktails';

    UPDATE menu_categories
    SET image_url = 'https://images.pexels.com/photos/1028637/pexels-photo-1028637.jpeg?auto=compress&cs=tinysrgb&w=800'
    WHERE restaurant_id = rest_id AND name = 'Spirit Free';

    UPDATE menu_categories
    SET image_url = 'https://images.pexels.com/photos/2067431/pexels-photo-2067431.jpeg?auto=compress&cs=tinysrgb&w=800'
    WHERE restaurant_id = rest_id AND name = 'Wine';

    -- Add sample images to featured menu items
    UPDATE menu_items
    SET image_url = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600'
    WHERE restaurant_id = rest_id AND name = 'Truffle Arugula';

    UPDATE menu_items
    SET image_url = 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600'
    WHERE restaurant_id = rest_id AND name = 'Quinoa Tabouleh';

    UPDATE menu_items
    SET image_url = 'https://images.pexels.com/photos/2089717/pexels-photo-2089717.jpeg?auto=compress&cs=tinysrgb&w=600'
    WHERE restaurant_id = rest_id AND name = 'Crispy Calamari';

    UPDATE menu_items
    SET image_url = 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=600'
    WHERE restaurant_id = rest_id AND name = 'Margherita';

    UPDATE menu_items
    SET image_url = 'https://images.pexels.com/photos/803963/pexels-photo-803963.jpeg?auto=compress&cs=tinysrgb&w=600'
    WHERE restaurant_id = rest_id AND name = 'Pepperoni';

    UPDATE menu_items
    SET image_url = 'https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?auto=compress&cs=tinysrgb&w=600'
    WHERE restaurant_id = rest_id AND name = 'Grilled Salmon';

    UPDATE menu_items
    SET image_url = 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600'
    WHERE restaurant_id = rest_id AND name = 'Ribeye Steak';

    UPDATE menu_items
    SET image_url = 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600'
    WHERE restaurant_id = rest_id AND name = 'Classic Pancakes';

    UPDATE menu_items
    SET image_url = 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=600'
    WHERE restaurant_id = rest_id AND name = 'Eggs Benedict';

    UPDATE menu_items
    SET image_url = 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600'
    WHERE restaurant_id = rest_id AND name = 'Tiramisu';

    UPDATE menu_items
    SET image_url = 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=600'
    WHERE restaurant_id = rest_id AND name = 'Chocolate Lava Cake';

    UPDATE menu_items
    SET image_url = 'https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=600'
    WHERE restaurant_id = rest_id AND name = 'Espresso Martini';

    UPDATE menu_items
    SET image_url = 'https://images.pexels.com/photos/1028637/pexels-photo-1028637.jpeg?auto=compress&cs=tinysrgb&w=600'
    WHERE restaurant_id = rest_id AND name = 'Virgin Mojito';

  END IF;
END $$;
