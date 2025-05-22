import pygame
import music_classroom
import physical_classroom
import english_classroom


def scale_image(image, width, height):
    return pygame.transform.scale(image, (width, height))


def play_sound(file_path):
    pygame.mixer.init()
    pygame.mixer.music.load(file_path)
    pygame.mixer.music.play(-1)


def check_click_button(pos_button):
    if (
        pos_button[0][0] <= mouse_x <= pos_button[1][0]
        and pos_button[0][1] <= mouse_y <= pos_button[1][1]
    ):
        return True
    return False


pygame.init()
screen = pygame.display.set_mode((1500, 860))
pygame.display.set_caption("Happy Classroom")
bg = scale_image(pygame.image.load("images/classroom.jpg"), 1500, 860)
pos_button1 = [[25, 415], [475, 672]]
pos_button2 = [[520, 415], [970, 672]]
pos_button3 = [[1015, 415], [1465, 672]]

play_sound("nightshade.mp3")
running = True
while running:
    global mouse_x, mouse_y
    mouse_x, mouse_y = pygame.mouse.get_pos()
    screen.blit(bg, (0, 0))
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if check_click_button(pos_button1):
                music_classroom.main()
            if check_click_button(pos_button2):
                physical_classroom.main()
            if check_click_button(pos_button3):
                english_classroom.main()
    pygame.display.update()

pygame.quit()
