import pygame
import random
import os
import sys


def scale_image(image, width, height):
    return pygame.transform.scale(image, (width, height))


class Card(object):
    back = scale_image(pygame.image.load("images/card/card_back.png"), 186, 300)

    def __init__(self, id_card, x, y):
        self.id = id_card
        self.flip = False
        self.marked = False
        self.x = x
        self.y = y

    def check_click_button(self):
        if (
            not self.marked
            and self.x <= mouse_x <= self.x + 186
            and self.y <= mouse_y <= self.y + 300
        ):
            return True
        return False

    def act_flip(self):
        global flip_count, step
        if not self.marked and not self.flip:
            if flip_count == 2:
                flip_count = 0
                if not check_same():
                    for card in cards:
                        card.flip = False
            flip_count += 1
            self.flip = True
            step += 1


def check_same():
    global score
    cmp = []
    for card in cards:
        if not card.marked and card.flip:
            cmp.append(card)
    if cmp[0].id == cmp[1].id:
        new_id = cmp[1].id
        for card in cards:
            if not card.marked and card.id == new_id:
                card.marked = True
        score += 10
        return True
    else:
        return False


def check_end():
    global end, score
    if flip_count == 2 and score == 50:
        score += 10
        for card in cards:
            card.marked = True
        update_display()
        win.blit(
            scale_image(pygame.image.load("images/win.png"), 500, 500),
            (500, 100),
        )
        end = True
    keys = pygame.key.get_pressed()
    if keys[pygame.K_SPACE]:
        python = sys.executable
        os.execl(python, python, *sys.argv)
    pygame.display.update()


def update_display():
    win.blit(bg, (0, 0))
    index = 0
    for y in y_cors:
        for x in x_cors:
            if not cards[index].marked:
                if cards[index].flip:
                    win.blit(card_shapes[cards[index].id], (x, y))
                else:
                    win.blit(cards[index].back, (x, y))
            index += 1
    score_rect = pygame.font.Font(None, 50).render(
        "Score: " + str(score), True, "Dark Green", "White"
    )
    step_rect = pygame.font.Font(None, 50).render(
        "Step: " + str(step), True, "Dark Red", "White"
    )
    win.blit(score_rect, (50, 50))
    win.blit(step_rect, (50, 100))
    pygame.display.update()


def main():
    global bg, win, clock, run, speed, end, score, cards, card_shapes, flip_count, x_cors, y_cors, step
    pygame.init()
    bg = scale_image(pygame.image.load("images/library.jpg"), 1500, 860)
    win = pygame.display.set_mode((1500, 860))
    pygame.display.set_caption("English Classroom")
    clock = pygame.time.Clock()
    card_shapes = [
        scale_image(pygame.image.load("images/card/card(" + str(i) + ").png"), 186, 300)
        for i in range(1, 7)
    ]
    duplicated_list = list(range(6)) * 2
    random.shuffle(card_shapes)
    random.shuffle(duplicated_list)
    x_cors = [90, 320, 550, 780, 1010, 1240]
    y_cors = [150, 500]
    cards = []
    index = 0
    for y in y_cors:
        for x in x_cors:
            cards.append(Card(duplicated_list[index], x, y))
            index += 1
    flip_count = 0
    score = 0
    step = 0
    run = True
    speed = 20
    end = False

    while run:
        check_end()
        if not end:
            global mouse_x, mouse_y
            mouse_x, mouse_y = pygame.mouse.get_pos()
            clock.tick(speed)
            update_display()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                for card in cards:
                    if card.check_click_button():
                        card.act_flip()

    pygame.quit()
    quit()


if __name__ == "__main__":
    main()
