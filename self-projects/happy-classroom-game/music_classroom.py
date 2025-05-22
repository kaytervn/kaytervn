import pygame
import random
import sys
import os


def scale_image(image, width, height):
    return pygame.transform.scale(image, (width, height))


class Player(object):
    def __init__(self, x, y, width, height):
        self.x = x
        self.y = y
        self.init_y = y
        self.width = width
        self.height = height
        self.left = True
        self.stand_count = 0
        self.stand = [
            scale_image(
                pygame.image.load("images/stand/stand(" + str(i) + ").png"),
                self.width,
                self.height,
            )
            for i in range(1, 16)
        ]
        self.jumping = False
        self.jump_count = 0
        self.jump = [
            scale_image(
                pygame.image.load("images/jump/jump(" + str(i) + ").png"),
                self.width,
                self.height,
            )
            for i in range(1, 24)
        ]
        self.strumming = False
        self.strum_count = 0
        self.strum = [
            scale_image(
                pygame.image.load("images/strum/strum(" + str(i) + ").png"),
                self.width,
                self.height,
            )
            for i in range(1, 10)
        ]

    def act_jump(self):
        self.y -= self.jump_count * 1.1
        if self.jump_count >= 25 // 2:
            self.y += self.jump_count * 1.3
        if self.jump_count > 22:
            self.jump_count = 0
            self.jumping = False
            self.stand_count = 0
            self.y = self.init_y
        if not self.left:
            win.blit(
                pygame.transform.flip(self.jump[self.jump_count], True, False),
                (self.x, self.y),
            )
        else:
            win.blit(self.jump[self.jump_count], (self.x, self.y))
        self.jump_count += 1

    def act_strum(self):
        if self.strum_count > 8:
            self.strum_count = 0
            self.strumming = False
            self.stand_count = 0
            self.y = self.init_y
        if not self.left:
            win.blit(
                pygame.transform.flip(self.strum[self.strum_count], True, False),
                (self.x, self.y),
            )
        else:
            win.blit(self.strum[self.strum_count], (self.x, self.y))
        self.strum_count += 1

    def act_stand(self):
        if self.stand_count > 14:
            self.stand_count = 0
        if not self.left:
            win.blit(
                pygame.transform.flip(self.stand[self.stand_count], True, False),
                (self.x, self.y),
            )
        else:
            win.blit(self.stand[self.stand_count], (self.x, self.y))
        self.stand_count += 1

    def draw(self):
        if self.jumping:
            self.act_jump()
        elif self.strumming:
            self.act_strum()
        else:
            self.act_stand()


class Note(object):
    skins = [
        scale_image(pygame.image.load("images/note/note" + str(i) + ".png"), 100, 100)
        for i in range(1, 5)
    ]
    pop = scale_image(pygame.image.load("images/pop.png"), 150, 150)
    init_pos_list = [(0, 300), (0, 600), (1500, 300), (1500, 600)]

    def __init__(self):
        self.shape = random.choice(self.skins)
        self.init_pos = random.choice(self.init_pos_list)
        self.x = self.init_pos[0]
        self.y = self.init_pos[1]
        self.speed = 10

    def move(self):
        if (
            self.init_pos == self.init_pos_list[0]
            or self.init_pos == self.init_pos_list[1]
        ):
            self.x += self.speed
        else:
            self.x -= self.speed

    def pop_check_pos1(self):
        return (self.x >= 380 and self.x <= 420) and self.y == 300

    def pop_check_pos2(self):
        return (self.x >= 380 and self.x <= 420) and self.y == 600

    def pop_check_pos3(self):
        return (self.x >= 980 and self.x <= 1020) and self.y == 300

    def pop_check_pos4(self):
        return (self.x >= 980 and self.x <= 1020) and self.y == 600

    def draw(self):
        global score, miss
        if self.x >= 425 and self.x <= 975:
            if self.shape == self.pop:
                score += 10
            else:
                miss += 1
            self.jump()
        self.move()
        win.blit(self.shape, (self.x, self.y))

    def jump(self):
        self.shape = random.choice(self.skins)
        self.init_pos = random.choice(self.init_pos_list)
        self.x = self.init_pos[0]
        self.y = self.init_pos[1]


class Target(object):
    def __init__(self):
        self.shape = scale_image(pygame.image.load("images/target.png"), 100, 100)
        self.left = True
        self.pos1 = (400, 300)
        self.pos2 = (400, 600)
        self.pos3 = (1000, 300)
        self.pos4 = (1000, 600)

    def draw(self):
        self.fluctuate(5)
        if self.left:
            win.blit(self.shape, self.pos1)
            win.blit(self.shape, self.pos2)
        else:
            win.blit(self.shape, self.pos3)
            win.blit(self.shape, self.pos4)

    def fluctuate(self, num):
        self.pos1 = (
            random.randint(400 - num, 400 + num),
            random.randint(300 - num, 300 + num),
        )
        self.pos2 = (
            random.randint(400 - num, 400 + num),
            random.randint(600 - num, 600 + num),
        )
        self.pos3 = (
            random.randint(1000 - num, 1000 + num),
            random.randint(300 - num, 300 + num),
        )
        self.pos4 = (
            random.randint(1000 - num, 1000 + num),
            random.randint(600 - num, 600 + num),
        )


def update_display():
    win.blit(bg, (0, 0))
    win.blit(music_effect, (meX1, 0))
    win.blit(music_effect, (meX2, 0))
    player.draw()
    target.draw()
    note.draw()


def check_end():
    global end
    if score >= 100:
        win.blit(
            scale_image(pygame.image.load("images/win.png"), 500, 500),
            (500, 100),
        )
        end = True
    if miss >= 3:
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
    global bg, music_effect, win, meX1, meX2, clock, target, note, player, run, end, speed, score, miss
    pygame.init()
    bg = scale_image(pygame.image.load("images/music_class.jpg"), 1500, 860)
    music_effect = scale_image(pygame.image.load("images/music_effect.png"), 1500, 860)
    win = pygame.display.set_mode((1500, 860))
    pygame.display.set_caption("Music Classroom")
    meX1 = 0
    meX2 = music_effect.get_width()
    clock = pygame.time.Clock()
    target = Target()
    note = Note()
    player = Player(570, 450, 400, 400)
    run = True
    end = False
    speed = 20
    score = 0
    miss = 0
    clock = pygame.time.Clock()

    while run:
        check_end()
        if not end:
            clock.tick(speed)
            update_display()
            score_rect = pygame.font.Font(None, 50).render(
                "Score: " + str(score), True, "Dark Green", "White"
            )
            miss_rect = pygame.font.Font(None, 50).render(
                "Miss: " + str(miss), True, "Dark Red", "White"
            )
            win.blit(score_rect, (50, 50))
            win.blit(miss_rect, (50, 100))
            pygame.display.update()

            meX1 -= 1.4
            meX2 -= 1.4
            if meX1 < music_effect.get_width() * -1:
                meX1 = music_effect.get_width()
            if meX2 < music_effect.get_width() * -1:
                meX2 = music_effect.get_width()

            keys = pygame.key.get_pressed()
            if keys[pygame.K_UP]:
                player.jumping = True
                if (player.left and note.pop_check_pos1()) or (
                    not player.left and note.pop_check_pos3()
                ):
                    note.shape = note.pop

            if keys[pygame.K_DOWN]:
                player.strumming = True
                if (player.left and note.pop_check_pos2()) or (
                    not player.left and note.pop_check_pos4()
                ):
                    note.shape = note.pop

            if keys[pygame.K_LEFT]:
                target.left = True
                player.left = True

            if keys[pygame.K_RIGHT]:
                target.left = False
                player.left = False

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False

    pygame.quit()
    quit()


if __name__ == "__main__":
    main()
