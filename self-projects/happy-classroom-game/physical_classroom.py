import pygame
import random
import os
import sys


def scale_image(image, width, height):
    return pygame.transform.scale(image, (width, height))


class Player(object):
    def __init__(self):
        self.pos = [[100 - i * 10, 300] for i in range(211)]
        self.direction = 0
        self.left = False
        self.lenght = 1
        self.run_count = 0
        self.run = [
            scale_image(
                pygame.image.load("images/run/run(" + str(i) + ").png"), 200, 200
            )
            for i in range(1, 11)
        ]
        self.cat_walk_count = 0
        self.cat_walk = [
            scale_image(
                pygame.image.load("images/cat/walk(" + str(i) + ").png"), 200, 200
            )
            for i in range(1, 8)
        ]

    def moveRight(self):
        if self.direction != 1:
            self.direction = 0

    def moveLeft(self):
        if self.direction != 0:
            self.direction = 1

    def moveUp(self):
        if self.direction != 3:
            self.direction = 2

    def moveDown(self):
        if self.direction != 2:
            self.direction = 3

    def act_run(self):
        if self.run_count > 9:
            self.run_count = 0
        if self.cat_walk_count > 6:
            self.cat_walk_count = 0
        for i in range(10, self.lenght * 10, 10):
            if not self.left:
                win.blit(
                    pygame.transform.flip(
                        self.cat_walk[self.cat_walk_count], True, False
                    ),
                    self.pos[i],
                )
            else:
                win.blit(self.cat_walk[self.cat_walk_count], self.pos[i])
        if not self.left:
            win.blit(
                pygame.transform.flip(self.run[self.run_count], True, False),
                self.pos[0],
            )
        else:
            win.blit(self.run[self.run_count], self.pos[0])
        self.run_count += 1
        self.cat_walk_count += 1

    def check_collision(self):
        if (
            self.pos[0] in self.pos[10 : self.lenght * 10]
            or self.pos[0][1] < -30
            or self.pos[0][1] > 570
        ):
            return True
        return False

    def draw(self):
        head = self.pos[0].copy()
        if self.direction == 0:
            self.left = False
            head[0] += 10
            if head[0] > 1500:
                head[0] = -100
        elif self.direction == 1:
            self.left = True
            head[0] -= 10
            if head[0] < -100:
                head[0] = 1500
        elif self.direction == 2:
            head[1] -= 10
        elif self.direction == 3:
            head[1] += 10
        self.pos.insert(0, head)
        self.pos.pop()
        self.act_run()


class Cat(object):
    def __init__(self):
        self.pos = [random.randint(0, 1400), random.randint(90, 650)]
        self.left = False
        self.stand_count = 0
        self.stand = [
            scale_image(
                pygame.image.load("images/cat/stand(" + str(i) + ").png"), 100, 100
            )
            for i in range(1, 8)
        ]

    def act_stand(self):
        if self.stand_count > 6:
            self.stand_count = 0
        if not self.left:
            win.blit(
                pygame.transform.flip(self.stand[self.stand_count], True, False),
                self.pos,
            )
        else:
            win.blit(self.stand[self.stand_count], self.pos)
        self.stand_count += 1

    def collides_player(self):
        if (
            self.pos[0] < player.pos[0][0] + 110
            and self.pos[0] + 110 > player.pos[0][0]
            and self.pos[1] < player.pos[0][1] + 110
            and self.pos[1] + 110 > player.pos[0][1]
        ):
            return True
        return False

    def draw(self):
        if self.collides_player():
            self.jump()
            player.lenght += 1
        self.act_stand()

    def jump(self):
        if random.randint(1, 2) == 1:
            self.left = True
        else:
            self.left = False
        self.pos = [random.randint(0, 1400), random.randint(90, 650)]


def update_display():
    win.blit(bg, (0, 0))
    player.draw()
    cat.draw()


def check_end():
    global end
    if player.lenght >= 21:
        win.blit(
            scale_image(pygame.image.load("images/win.png"), 500, 500),
            (500, 100),
        )
        end = True
    if player.check_collision():
        win.blit(
            scale_image(pygame.image.load("images/lose.png"), 500, 500),
            (500, 100),
        )
        end = True
    keys = pygame.key.get_pressed()
    if keys[pygame.K_SPACE]:
        python = sys.executable
        os.execl(python, python, *sys.argv)
    pygame.display.update()


def main():
    global bg, win, clock, player, cat, run, speed, end
    pygame.init()
    bg = scale_image(pygame.image.load("images/yard.jpg"), 1500, 860)
    win = pygame.display.set_mode((1500, 860))
    pygame.display.set_caption("Physical Classroom")
    clock = pygame.time.Clock()
    player = Player()
    cat = Cat()
    run = True
    speed = 20
    end = False
    pygame.time.set_timer(pygame.USEREVENT + 1, 1500)

    while run:
        check_end()
        if not end:
            clock.tick(speed)
            update_display()
            score_rect = pygame.font.Font(None, 50).render(
                "Score: " + str(player.lenght * 10 - 10), True, "Dark Green", "White"
            )
            win.blit(score_rect, (50, 50))
            pygame.display.update()

            keys = pygame.key.get_pressed()
            if keys[pygame.K_UP]:
                player.moveUp()

            if keys[pygame.K_DOWN]:
                player.moveDown()

            if keys[pygame.K_LEFT]:
                player.moveLeft()

            if keys[pygame.K_RIGHT]:
                player.moveRight()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
            if event.type == pygame.USEREVENT + 1:
                if speed < 60:
                    speed += 1
    pygame.quit()
    quit()


if __name__ == "__main__":
    main()
