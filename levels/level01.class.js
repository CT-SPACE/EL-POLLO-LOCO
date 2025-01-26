const level01 = new Level(
    [
        new Clouds(),
        new Clouds()
        ],
        [
            new movingBackground(0),
            new movingBackground(1),
            new movingBackground(4),
            new movingBackground(2),

            // new movingBackground(4),
            // new movingBackground(5),
            // new movingBackground(6),
            // new movingBackground(7),
            // new movingBackground(8)
        ],
        [ 
            new Chicken(),
            new Chicken(), 
            new Chicken() 
        ]

)
