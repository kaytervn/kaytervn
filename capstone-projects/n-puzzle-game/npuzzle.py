import tkinter as tk
import threading
import random
import time
import queue
import heapq
import threading
import sys
import os
import math
from tkinter import ttk
from tkinter import filedialog
from tkinter import messagebox
from PIL import Image, ImageTk
from collections import deque


global ROW, COL, image_mapping
step_count = 0
total_steps = 0
total_nodes = 0
solving_time = 0
shuffling_count = 0
depth_limit = 1
stop = False
speed = 0.2
buttons = []


def run_game(ROW, COL):
    global record_row, puzzle, saved_state, goal, SIZE
    SIZE = int(300 / ROW)
    record_row = 8 + COL
    puzzle = list(range(0, ROW * COL))
    saved_state = list(range(0, ROW * COL))
    goal = list(range(0, ROW * COL))

    def create_square_image():
        square_image = Image.new("RGB", (100, 100), "darkblue")
        return square_image

    def is_solved(puzzle):
        return puzzle == goal

    def move(puzzle, move_to):
        empty_index = puzzle.index(0)
        move_index = puzzle.index(move_to)

        if (
            empty_index % COL == move_index % COL
            and abs(empty_index - move_index) == COL
        ) or (
            empty_index // COL == move_index // COL
            and abs(empty_index - move_index) == 1
        ):
            puzzle[empty_index] = move_to
            puzzle[move_index] = 0

    def update_display():
        for i in range(ROW):
            for j in range(COL):
                button = buttons[i][j]
                value = puzzle[i * COL + j]
                photo = image_mapping[value]

                if value == 0:
                    button.config(text="", image=photo)
                else:
                    button.config(
                        text=value,
                        compound="center",
                        fg="white",
                        font=("Tahoma", 20, "bold"),
                        image=photo,
                    )
                button.config(state=tk.NORMAL if value else tk.DISABLED)
        window.update()

    def on_button_click(row, col):
        move_to = puzzle[row * COL + col]
        move(puzzle, move_to)
        update_display()

    def on_key_press(event):
        zero_index = puzzle.index(0)
        row, col = divmod(zero_index, COL)

        if event.keysym == "Up" and row > 0:
            move_to = puzzle[zero_index - COL]
        elif event.keysym == "Down" and row < ROW - 1:
            move_to = puzzle[zero_index + COL]
        elif event.keysym == "Left" and col > 0:
            move_to = puzzle[zero_index - 1]
        elif event.keysym == "Right" and col < COL - 1:
            move_to = puzzle[zero_index + 1]
        else:
            return

        move(puzzle, move_to)
        update_display()

    def possible_moves(current_node):
        moves = []

        empty_index = current_node.index(0)
        row, col = empty_index // COL, empty_index % COL

        for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            new_row, new_col = row + dr, col + dc

            if 0 <= new_row < ROW and 0 <= new_col < COL:
                new_empty_index = new_row * COL + new_col
                new_node = list(current_node)
                new_node[empty_index], new_node[new_empty_index] = (
                    new_node[new_empty_index],
                    new_node[empty_index],
                )
                moves.append((new_node, new_node[empty_index]))
        random.shuffle(moves)
        return moves

    def random_shuffle(puzzle):
        visited = set()
        visited.add(tuple(puzzle))
        count = 0
        while count < ROW * COL * 10:
            nodes = possible_moves(puzzle)
            for item in nodes:
                node, pos_move = item
                if tuple(node) not in visited:
                    move(puzzle, pos_move)
                    visited.add(tuple(node))
            count += 1
        update_display()

    def update_infor_lables():
        update_total_nodes_count(total_nodes)
        update_step_count(step_count)
        update_total_steps_count(total_steps)
        update_shuffling_count(shuffling_count)
        update_depth_limit_count(depth_limit)
        window.update()

    def reset_infor_lables():
        global total_nodes, step_count, total_steps, solving_time, depth_limit
        step_count = 0
        total_steps = 0
        total_nodes = 0
        solving_time = 0
        update_infor_lables()

    def state_to_string(state):
        puzzle_string = ""
        for i in range(ROW):
            for j in range(COL):
                cell_value = str(state[i * COL + j]).zfill(2)
                puzzle_string += "{:^5}".format(cell_value)
            puzzle_string += "\n"
        return puzzle_string

    def update_depth_limit_count(count):
        depth_limit_label.config(text=f"{count}")

    def update_step_count(count):
        step_label.config(text=f"{count}")

    def update_total_steps_count(count):
        total_steps_label.config(text=f"{count}")

    def update_total_nodes_count(count):
        total_nodes_label.config(text=f"{count}")

    def update_solving_time(count):
        time_label.config(text=f"{count:.2f}s")

    def update_shuffling_count(count):
        shuffling_count_label.config(text=f"{count}")

    def bfs_solve(puzzle):
        global total_nodes
        total_nodes = 0
        visited = set()
        start_node = tuple(puzzle)
        queue = deque([(start_node, [])])
        while queue and not stop:
            current_node, path = queue.popleft()
            for item in possible_moves(current_node):
                node, pos_move = item
                if tuple(node) not in visited:
                    visited.add(tuple(node))
                    total_nodes += 1
                    new_path = path + [pos_move]
                    if is_solved(list(node)):
                        return new_path
                    queue.append((node, new_path))
        return None

    def dfs_solve(puzzle):
        global total_nodes, stop
        total_nodes = 0
        start_node = tuple(puzzle)
        stack = [(start_node, [])]
        visited = set()
        while stack and not stop:
            current_node, path = stack.pop()
            for item in possible_moves(current_node):
                node, pos_move = item
                if tuple(node) not in visited:
                    total_nodes += 1
                    visited.add(tuple(node))
                    new_path = path + [pos_move]
                    if is_solved(list(node)):
                        return new_path
                    stack.append((node, new_path))
        return None

    def dls_solve(puzzle, depth_limit):
        global total_nodes
        start_node = tuple(puzzle)
        stack = [(start_node, [], 0)]
        visited = set()
        while stack and not stop:
            current_node, path, depth = stack.pop()
            if is_solved(list(current_node)):
                return path
            if depth == depth_limit:
                continue
            for item in possible_moves(current_node):
                node, pos_move = item
                if tuple(node) not in visited:
                    total_nodes += 1
                    visited.add(tuple(node))
                    new_path = path + [pos_move]
                    stack.append((node, new_path, depth + 1))
        return None

    def iddfs_solve(puzzle):
        global depth_limit
        depth_limit = 1
        result = dls_solve(puzzle, depth_limit)
        while not result and not stop:
            depth_limit += 1
            result = dls_solve(puzzle, depth_limit)
        return result

    def ucs_solve(puzzle):
        global total_nodes
        total_nodes = 0
        priority_queue = queue.PriorityQueue()
        visited = set()
        start_node = tuple(puzzle)
        priority_queue.put((0, start_node, []))
        while not priority_queue.empty() and not stop:
            cost, current_node, path = priority_queue.get()
            for item in possible_moves(current_node):
                node, pos_move = item
                if tuple(node) not in visited:
                    total_nodes += 1
                    new_path = path + [pos_move]
                    visited.add(tuple(node))
                    new_cost = cost + 1
                    if is_solved(list(node)):
                        return new_path
                    priority_queue.put((new_cost, tuple(node), new_path))
        return None

    def manhattan_distance(puzzle):
        distance = 0
        for i in range(ROW):
            for j in range(COL):
                if puzzle[i * COL + j] != 0:
                    correct_row = (puzzle[i * COL + j]) // COL
                    correct_col = (puzzle[i * COL + j]) % COL
                    distance += abs(i - correct_row) + abs(j - correct_col)
        return distance

    def hamming_distance(puzzle):
        distance = 0
        for i in range(ROW):
            for j in range(COL):
                if puzzle[i * COL + j] != 0 and puzzle[i * COL + j] != i * COL + j + 1:
                    distance += 1
        return distance

    def linear_conflict(puzzle):
        conflicts = 0
        for i in range(ROW):
            for j in range(COL):
                if puzzle[i * COL + j] != 0:
                    correct_row = (puzzle[i * COL + j] - 1) // COL
                    correct_col = (puzzle[i * COL + j] - 1) % COL
                    if i == correct_row and j != correct_col:
                        conflicts += sum(
                            1
                            for k in range(j + 1, COL)
                            if puzzle[i * COL + k] != 0
                            and (puzzle[i * COL + k] - 1) // COL == i
                            and (puzzle[i * COL + k] - 1) % COL < correct_col
                        )
                    elif j == correct_col and i != correct_row:
                        conflicts += sum(
                            1
                            for k in range(i + 1, ROW)
                            if puzzle[k * COL + j] != 0
                            and (puzzle[k * COL + j] - 1) % COL == j
                            and (puzzle[k * COL + j] - 1) // COL < correct_row
                        )
        return conflicts * 2

    def misplaced_tiles(puzzle):
        count = 0
        for i in range(0, len(puzzle)):
            if puzzle[i] != i:
                count += 1
        return count

    def comparator(puzzle):
        if heuristic_rb.get() == "manhattan":
            return manhattan_distance(puzzle)
        elif heuristic_rb.get() == "hamming":
            return hamming_distance(puzzle)
        elif heuristic_rb.get() == "linear conflict":
            return linear_conflict(puzzle)
        else:
            return misplaced_tiles(puzzle)

    def greedy_solve(puzzle):
        global total_nodes
        total_nodes = 0
        priority_queue = queue.PriorityQueue()
        visited = set()
        start_node = tuple(puzzle)
        priority_queue.put((0, start_node, []))
        while not priority_queue.empty() and not stop:
            _, current_node, path = priority_queue.get()
            for item in possible_moves(current_node):
                node, pos_move = item
                if tuple(node) not in visited:
                    visited.add(tuple(node))
                    total_nodes += 1
                    new_path = path + [pos_move]
                    new_cost = comparator(node)
                    if is_solved(list(node)):
                        return new_path
                    priority_queue.put((new_cost, tuple(node), new_path))
        return None

    def A_solve(puzzle):
        global total_nodes
        total_nodes = 0
        priority_queue = [(comparator(puzzle), 0, tuple(puzzle), [])]
        visited = set()
        while priority_queue and not stop:
            _, g_value, current_node, path = heapq.heappop(priority_queue)
            for item in possible_moves(current_node):
                node, pos_move = item
                if tuple(node) not in visited:
                    visited.add(tuple(node))
                    total_nodes += 1
                    new_path = path + [pos_move]
                    new_cost = g_value + 1 + comparator(node)
                    if is_solved(list(node)):
                        return new_path
                    heapq.heappush(
                        priority_queue,
                        (
                            new_cost,
                            g_value + 1,
                            tuple(node),
                            new_path,
                        ),
                    )
        return None

    def IDA_solve(puzzle):
        global total_nodes
        total_nodes = 0
        threshold = comparator(puzzle)

        def dls(puzzle, threshold):
            global total_nodes
            start_node = tuple(puzzle)
            stack = [(start_node, [], 0)]
            visited = set()
            min_cost = float("inf")

            while stack and not stop:
                current_node, path, g_value = stack.pop()
                f_value = g_value + comparator(current_node)

                if f_value > threshold:
                    min_cost = min(min_cost, f_value)
                    continue

                if is_solved(list(current_node)):
                    return path, float("inf")

                for item in possible_moves(current_node):
                    node, pos_move = item
                    if tuple(node) not in visited:
                        total_nodes += 1
                        visited.add(tuple(node))
                        new_path = path + [pos_move]
                        stack.append((node, new_path, g_value + 1))

            return None, min_cost

        while not stop:
            result, new_threshold = dls(puzzle, threshold)
            if result is not None:
                return result
            if new_threshold == float("inf"):
                return None
            threshold = new_threshold

    def bidirectional_solve(puzzle):
        global total_nodes
        total_nodes = 0
        forward_open = deque([(tuple(puzzle), [])])
        backward_open = deque([(tuple(goal), [])])
        forward_visited = set()
        backward_visited = {}

        while forward_open and backward_open and not stop:
            forward_state, forward_path = forward_open.popleft()
            backward_state, backward_path = backward_open.popleft()

            if tuple(forward_state) in backward_visited:
                return forward_path + list(backward_visited[tuple(forward_state)])[::-1]

            for item in possible_moves(forward_state):
                node, pos_move = item
                if tuple(node) not in forward_visited:
                    total_nodes += 1
                    forward_visited.add(tuple(node))
                    new_path = forward_path + [pos_move]
                    forward_open.append((node, new_path))

            for item in possible_moves(backward_state):
                node, pos_move = item
                if tuple(node) not in backward_visited:
                    total_nodes += 1
                    new_path = backward_path + [pos_move]
                    backward_visited[tuple(node)] = new_path
                    backward_open.append((node, new_path))

        return None

    def hc_solve(puzzle):
        global total_nodes
        total_nodes = 0
        start_node = tuple(puzzle)
        queue = deque([(start_node, [])])
        while queue and not stop:
            current_node, path = queue.popleft()
            node, pos_move = possible_moves(current_node)[0]
            cost = comparator(node)
            for i in range(1, len(possible_moves(current_node))):
                if cost >= comparator(node):
                    cost = comparator(node)
                    node, pos_move = possible_moves(current_node)[i]
                    total_nodes += 1
                else:
                    return None
            new_path = path + [pos_move]
            if is_solved(list(node)):
                return new_path
            queue.append((node, new_path))
        return None

    def hc_loop(puzzle):
        global shuffling_count
        shuffling_count = 0
        path = hc_solve(puzzle)
        while not path and not stop:
            random_shuffle(puzzle)
            shuffling_count += 1
            path = hc_solve(puzzle)
        return path

    def beam_solve(puzzle):
        global total_nodes
        total_nodes = 0
        visited = set()
        start_node = tuple(puzzle)
        queue1 = deque([(start_node, [])])
        while queue1 and not stop:
            current_node, path = queue1.popleft()
            k = random.randint(2, len(possible_moves(current_node)))
            top_k_elements = []
            priority_queue = queue.PriorityQueue()
            for item in possible_moves(current_node):
                node, pos_move = item
                priority_queue.put((comparator(node), node, pos_move))
            for _ in range(k):
                if not priority_queue.empty():
                    top_k_elements.append(priority_queue.get())
            for item in top_k_elements:
                _, node, pos_move = item
                if tuple(node) not in visited:
                    visited.add(tuple(node))
                    total_nodes += 1
                    new_path = path + [pos_move]
                    if is_solved(list(node)):
                        return new_path
                    queue1.append((node, new_path))
        return None

    def sa_solve(puzzle):
        def acceptance_probability(cost, new_cost, temperature):
            if new_cost < cost:
                return 1.0
            return math.exp((cost - new_cost) / temperature)

        global total_nodes
        total_nodes = 0
        temperature = 1.0
        cooling_rate = 0.99
        current_state = tuple(puzzle)
        path = []
        while temperature > 0.01 and not stop:
            neighbors = possible_moves(current_state)
            next_state, move = random.choice(neighbors)
            current_cost = comparator(current_state)
            new_cost = comparator(next_state)
            if (
                acceptance_probability(current_cost, new_cost, temperature)
                > random.random()
            ):
                total_nodes += 1
                path.append(move)
                current_state = next_state
            if is_solved(list(current_state)):
                return path
            temperature *= cooling_rate
        return None

    def sa_loop(puzzle):
        global shuffling_count
        shuffling_count = 0
        path = sa_solve(puzzle)
        while not path and not stop:
            random_shuffle(puzzle)
            shuffling_count += 1
            path = sa_solve(puzzle)
        return path

    def add_record():
        global record_row
        if not is_solved(puzzle):
            color = "red"
        else:
            color = "black"

        labels_data = [
            algorithm_combobox.get(),
            f"{solving_time:.2f}s",
            str(step_count),
            str(total_nodes),
            str(depth_limit) if algorithm_combobox.get() in ["DLS", "IDDFS"] else "",
            str(shuffling_count)
            if algorithm_combobox.get() in ["Hill Climbing", "Sim-Annealing"]
            else "",
            str(heuristic_rb.get())
            if algorithm_combobox.get()
            in [
                "A* Search",
                "IDA* Search",
                "Greedy",
                "Hill Climbing",
                "Sim-Annealing",
                "Beam Search",
            ]
            else "",
        ]

        for col, data in enumerate(labels_data):
            record_label = tk.Label(
                inner_frame,
                text=data,
                font=("Helvetica", 12, "italic"),
                fg=color,
            )
            record_label.grid(row=record_row, column=col)
        record_row += 1
        inner_frame.update_idletasks()
        canvas.config(scrollregion=canvas.bbox("all"))
        window.update()

    def disable_controls():
        global stop
        widgets_to_disable = [
            spinbox,
            apply_button,
            hamming_rb,
            manhattan_rb,
            linear_conflict_rb,
            misplaced_tiles_rb,
            algorithm_combobox,
        ]

        stop_btn.config(state=tk.NORMAL)
        stop = False

        for widget in widgets_to_disable:
            widget.config(state=tk.DISABLED)

        for button in control_buttons:
            button.config(state=tk.DISABLED)
        window.update()

    def enable_controls():
        global stop
        widgets_to_disable = [
            spinbox,
            apply_button,
            hamming_rb,
            manhattan_rb,
            linear_conflict_rb,
            misplaced_tiles_rb,
            algorithm_combobox,
        ]

        skip_btn.config(state=tk.DISABLED)
        stop_btn.config(state=tk.DISABLED)
        stop = False

        for widget in widgets_to_disable:
            widget.config(state=tk.NORMAL)
        algorithm_combobox.state(["readonly"])

        for button in control_buttons:
            button.config(state=tk.NORMAL)
        window.update()

    def validate_depth():
        try:
            value = int(spinbox.get())
            if 1 <= value <= 1000:
                pass
            else:
                if value < 1:
                    spinbox.delete(0, tk.END)
                    spinbox.insert(0, "1")
                else:
                    spinbox.delete(0, tk.END)
                    spinbox.insert(0, "1000")
        except ValueError:
            spinbox.delete(0, tk.END)
            spinbox.insert(0, "1")

    def on_spinbox_change():
        global depth_limit
        validate_depth()
        depth_limit = int(spinbox.get())
        update_infor_lables()

    def on_combobox_change(event):
        global depth_limit, shuffling_count
        selected_value = algorithm_combobox.get()
        reset_infor_lables()
        update_solving_time(solving_time)

        depth_limit_header_label.grid_forget()
        depth_limit_label.grid_forget()
        shuffling_count_header_label.grid_forget()
        shuffling_count_label.grid_forget()
        optional_label.grid_forget()
        apply_button.grid_forget()
        spinbox.grid_forget()
        hamming_rb.grid_forget()
        manhattan_rb.grid_forget()
        misplaced_tiles_rb.grid_forget()
        linear_conflict_rb.grid_forget()

        if selected_value == "IDDFS":
            depth_limit = 1
            depth_limit_header_label.grid(row=1, column=4, padx=30, pady=10)
            depth_limit_label.grid(row=2, column=4, pady=10)

        elif selected_value == "DLS":
            validate_depth()
            depth_limit = int(spinbox.get())
            depth_limit_header_label.grid(row=1, column=4, padx=30, pady=10)
            depth_limit_label.grid(row=2, column=4, pady=10)
            optional_label.grid(row=3, column=3, padx=5, pady=5)
            optional_label.config(text="Depth Limit:")
            spinbox.grid(row=3, column=4, padx=5, pady=5)
            apply_button.grid(row=3, column=5, padx=5, pady=5)

        elif (
            selected_value == "A* Search"
            or selected_value == "IDA* Search"
            or selected_value == "Greedy"
            or selected_value == "Hill Climbing"
            or selected_value == "Beam Search"
            or selected_value == "Sim-Annealing"
        ):
            hamming_rb.grid(row=3, column=6, padx=5, pady=5)
            manhattan_rb.grid(row=3, column=3, padx=5, pady=5)
            linear_conflict_rb.grid(row=3, column=5, padx=5, pady=5)
            misplaced_tiles_rb.grid(row=3, column=4, padx=5, pady=5)
            if selected_value == "Hill Climbing" or selected_value == "Sim-Annealing":
                shuffling_count = 0
                shuffling_count_header_label.grid(row=1, column=4, padx=30, pady=10)
                shuffling_count_label.grid(row=2, column=4, pady=10)

        update_infor_lables()

    def run_algorithm():
        global stop_event, thread_count, solving_time, step_count, total_steps, speed, puzzle, stop
        speed = 0.2
        reset_infor_lables()
        update_solving_time(solving_time)
        disable_controls()
        algorithms = {
            "BFS": bfs_solve,
            "DFS": dfs_solve,
            "DLS": lambda puzzle: dls_solve(puzzle, depth_limit),
            "IDDFS": iddfs_solve,
            "UCS": ucs_solve,
            "Greedy": greedy_solve,
            "A* Search": A_solve,
            "IDA* Search": IDA_solve,
            "Bidirectional": bidirectional_solve,
            "Hill Climbing": hc_loop,
            "Sim-Annealing": sa_loop,
            "Beam Search": beam_solve,
        }
        selected_algorithm = algorithm_combobox.get()
        start_time = time.time()
        solution = algorithms[selected_algorithm](puzzle)
        solving_time = time.time() - start_time

        if stop_event:
            stop_event.set()
            thread_count.join()

        update_solving_time(solving_time)
        update_infor_lables()

        if solution:
            total_steps = len(solution)
            update_total_steps_count(total_steps)
            skip_btn.config(state=tk.NORMAL)
            stop_btn.config(state=tk.DISABLED)
            stop = False
            step = 0
            for move_to in solution:
                if speed == 0:
                    step += 1
                    if step > 50:
                        puzzle = list(goal)
                        step_count = total_steps
                        update_display()
                        update_step_count(step_count)
                        break
                move(puzzle, move_to)
                update_display()
                step_count += 1
                update_step_count(step_count)
                time.sleep(speed)
        else:
            total_steps = 0
            update_total_steps_count(total_steps)
            messagebox.showwarning("Warning", "The process is ended!")

        window.update()
        add_record()
        enable_controls()

    def map_image(puzzle_image):
        global image_mapping
        puzzle_pieces = []
        for i in range(ROW):
            for j in range(COL):
                cropped_image = puzzle_image.crop(
                    (j * SIZE, i * SIZE, (j + 1) * SIZE, (i + 1) * SIZE)
                )
                puzzle_pieces.append(ImageTk.PhotoImage(cropped_image))
        image_mapping = dict(zip(list(range(0, ROW * COL)), puzzle_pieces))
        window.update()

    def upload_image():
        file_path = filedialog.askopenfilename()
        if file_path:
            puzzle_image = Image.open(file_path).resize((COL * SIZE, ROW * SIZE))
            map_image(puzzle_image)
            photo = ImageTk.PhotoImage(Image.open(file_path).resize((170, 170)))
            image_label.config(image=photo)
            image_label.image = photo
            update_display()

    def run_stopwatch():
        global stop_event
        start_time = time.time()
        while not stop_event.is_set():
            update_infor_lables()
            elapsed_time = time.time() - start_time
            time_label.config(text=f"{elapsed_time:.2f}s")
            time.sleep(0.1)

    def btn_skip_click():
        global speed
        speed = 0

    def btn_stop_click():
        global stop
        stop_btn.config(state=tk.DISABLED)
        stop = True
        window.update()

    def btn_export_click():
        global puzzle
        puzzle = list(saved_state)
        update_display()

    def btn_save_click():
        global saved_state
        saved_state = list(puzzle)
        state_label.config(text=state_to_string(saved_state))

    def btn_apply_click():
        global depth_limit
        validate_depth()
        depth_limit = int(spinbox.get())
        update_infor_lables()

    def btn_solve_click():
        global stop_event, thread_count, thread_solve
        if not is_solved(puzzle):
            stop_event = threading.Event()
            thread_solve = threading.Thread(target=run_algorithm)
            thread_solve.daemon = True
            thread_count = threading.Thread(target=run_stopwatch)
            thread_count.daemon = True
            thread_solve.start()
            thread_count.start()
        else:
            messagebox.showinfo("Information", "This puzzle is already solved!")

    def btn_random_click():
        reset_infor_lables()
        update_solving_time(solving_time)
        random_shuffle(puzzle)

    window = tk.Tk()
    window.bind("<KeyPress>", on_key_press)
    window.title("N Puzzle")

    puzzle_image = create_square_image().resize((COL * SIZE, ROW * SIZE))
    map_image(puzzle_image)

    frame = tk.Frame(window)
    frame.pack()

    frame1 = tk.Frame(frame)
    frame1.grid(row=2, column=0, columnspan=window.winfo_screenwidth())
    game_label = tk.Label(
        frame1, text="N PUZZLE", font=("Tahoma", 30, "bold"), fg="red"
    )
    game_label.grid(row=0, column=0, columnspan=window.winfo_screenwidth(), pady=10)

    header_labels = ["Total Steps", "Step", "Solving", "Nodes"]
    for col, label_text in enumerate(header_labels):
        header_label = tk.Label(frame1, text=label_text, font=("Helvetica", 20, "bold"))
        header_label.grid(row=1, column=col, padx=30, pady=10)

    # Infor Lables
    total_steps_label = tk.Label(frame1, text="0", font=("Helvetica", 20))
    total_steps_label.grid(row=2, column=0, pady=10)

    step_label = tk.Label(frame1, text="0", font=("Helvetica", 20))
    step_label.grid(row=2, column=1, pady=10)

    time_label = tk.Label(frame1, text="0.00s", font=("Helvetica", 20))
    time_label.grid(row=2, column=2, pady=10)

    total_nodes_label = tk.Label(frame1, text="0", font=("Helvetica", 20))
    total_nodes_label.grid(row=2, column=3, pady=10)

    depth_limit_header_label = tk.Label(
        frame1, text="Depth", font=("Helvetica", 20, "bold")
    )
    depth_limit_label = tk.Label(frame1, text="0", font=("Helvetica", 20))

    shuffling_count_header_label = tk.Label(
        frame1, text="Shuffling", font=("Helvetica", 20, "bold")
    )
    shuffling_count_label = tk.Label(frame1, text="0", font=("Helvetica", 20))

    frame2 = tk.Frame(frame)
    frame2.grid(row=5, column=0, pady=10, columnspan=window.winfo_screenwidth())

    state_label = tk.Label(
        frame2,
        font=("Helvetica", 10, "bold"),
        text=state_to_string(saved_state),
        bd=2,
        relief="solid",
    )
    state_label.grid(row=3, column=1, columnspan=2, rowspan=2)

    image_label = tk.Label(frame2)
    image_label.grid(row=3, column=0, rowspan=3)

    optional_label = tk.Label(frame2, font=("Helvetica", 20, "bold"))
    spinbox = tk.Spinbox(
        frame2,
        from_=1,
        to=1000,
        width=10,
        font=("Helvetica", 20),
        command=on_spinbox_change,
    )
    apply_button = tk.Button(
        frame2,
        text="Apply",
        width=15,
        height=2,
        font=("Helvetica", 12, "bold"),
        command=btn_apply_click,
        bg="lightgray",
    )

    heuristic_rb = tk.StringVar(value="manhattan")
    hamming_rb = tk.Radiobutton(
        frame2,
        text="Hamming",
        variable=heuristic_rb,
        value="hamming",
        font=("Helvetica", 15),
    )
    manhattan_rb = tk.Radiobutton(
        frame2,
        text="Manhattan",
        variable=heuristic_rb,
        value="manhattan",
        font=("Helvetica", 15),
    )
    linear_conflict_rb = tk.Radiobutton(
        frame2,
        text="Linear Conflict",
        variable=heuristic_rb,
        value="linear conflict",
        font=("Helvetica", 15),
    )
    misplaced_tiles_rb = tk.Radiobutton(
        frame2,
        text="Misplaced Tiles",
        variable=heuristic_rb,
        value="misplaced tiles",
        font=("Helvetica", 15),
    )

    # Control Buttons - Combobox
    algorithm_label = tk.Label(
        frame2, text="Algorithm:", font=("Helvetica", 20, "bold")
    )
    algorithm_label.grid(row=4, column=3, padx=5, pady=5)

    algorithm_combobox = ttk.Combobox(
        frame2,
        values=[
            "BFS",
            "DFS",
            "DLS",
            "IDDFS",
            "UCS",
            "Greedy",
            "A* Search",
            "IDA* Search",
            "Bidirectional",
            "Hill Climbing",
            "Sim-Annealing",
            "Beam Search",
        ],
    )
    algorithm_combobox.configure(width=11, font=("Helvetica", 17), height=20)
    algorithm_combobox.set("BFS")
    algorithm_combobox.state(["readonly"])
    algorithm_combobox.bind("<<ComboboxSelected>>", on_combobox_change)
    algorithm_combobox.grid(row=4, column=4, padx=5, pady=5)

    buttons_data = [
        ("Solve", 4, 5, btn_solve_click, "yellow", 15, 1),
        ("Save", 5, 1, btn_save_click, "lightblue", 7, 1),
        ("Export", 5, 2, btn_export_click, "lightblue", 7, 1),
        ("Random", 5, 4, btn_random_click, "lime", 15, 1),
        ("Change Size", 5, 3, restart_program, "orange", 15, 1),
        ("Upload Image", 5, 5, upload_image, "pink", 15, 1),
    ]

    control_buttons = []
    for text, row, column, command, bg_color, size, span in buttons_data:
        button = tk.Button(
            frame2,
            text=text,
            width=size,
            height=2,
            font=("Helvetica", 12, "bold"),
            command=command,
            bg=bg_color,
        )
        button.grid(row=row, column=column, padx=5, pady=5, columnspan=span)
        control_buttons.append(button)

    skip_btn = tk.Button(
        frame2,
        text="Skip",
        width=15,
        height=2,
        font=("Helvetica", 12, "bold"),
        command=btn_skip_click,
        bg="lightyellow",
        state=tk.DISABLED,
    )
    skip_btn.grid(row=4, column=6, padx=5, pady=5)

    stop_btn = tk.Button(
        frame2,
        text="Stop",
        width=15,
        height=2,
        font=("Helvetica", 12, "bold"),
        command=btn_stop_click,
        bg="red",
        state=tk.DISABLED,
        fg="white",
    )
    stop_btn.grid(row=5, column=6, padx=5, pady=5)

    # Puzzle Buttons
    puzzle_frame = tk.Frame(frame)
    puzzle_frame.grid(
        row=6,
        column=0,
        columnspan=window.winfo_screenwidth(),
        padx=10,
        pady=10,
    )
    for i in range(ROW):
        row = []
        for j in range(COL):
            button = tk.Button(puzzle_frame, image=image_mapping[i * COL + j])
            button.grid(row=i, column=j, padx=2, pady=2)
            button.config(command=lambda row=i, col=j: on_button_click(row, col))
            row.append(button)
        buttons.append(row)
    update_display()
    update_infor_lables()

    header_label = tk.Label(
        frame,
        text="History Records",
        font=("Helvetica", 20, "bold"),
        fg="red",
    )
    header_label.grid(
        row=record_row - 2,
        column=0,
        pady=10,
    )

    label_frame = tk.LabelFrame(
        frame,
        text="   Algorithm           Solving           Steps           Nodes           Depth           Shuffling           Heuristic",
        font=("Helvetica", 15, "bold"),
        borderwidth=0,
        highlightthickness=0,
    )
    label_frame.grid(row=record_row - 1, column=0, sticky="ew")

    canvas = tk.Canvas(label_frame, width=950, height=130)
    canvas.grid(row=0, column=0)

    # Create a Scrollbar widget
    scrollbar = tk.Scrollbar(label_frame, orient="vertical", command=canvas.yview)
    scrollbar.grid(row=0, column=1, sticky="ns")

    # Configure the Canvas to use the Scrollbar
    canvas.configure(yscrollcommand=scrollbar.set)

    # Create a frame inside the canvas to hold the labels
    inner_frame = tk.Frame(canvas)
    canvas.create_window((0, 0), window=inner_frame)

    header_labels = [
        "Algorithm",
        "Solving",
        "Steps",
        "Nodes",
        "Depth",
        "Shuffling",
        "Heuristic",
    ]
    for col, label_text in enumerate(header_labels):
        header_label = tk.Label(
            inner_frame,
            text=label_text,
            font=("Helvetica", 15, "bold"),
            fg=header_label["background"],
        )
        header_label.grid(row=record_row, column=col, padx=30)

    inner_frame.update_idletasks()
    canvas.config(scrollregion=canvas.bbox("all"))
    frame.grid_rowconfigure(0, weight=1)
    frame.grid_columnconfigure(0, weight=1)
    window.mainloop()


def start_game():
    global ROW, COL
    ROW = int(row_combobox.get())
    COL = int(col_combobox.get())
    if ROW > 0 and COL > 0:
        menu_window.destroy()
        run_game(ROW, COL)


def restart_program():
    python = sys.executable
    os.execl(python, python, *sys.argv)


menu_window = tk.Tk()
menu_window.title("N Puzzle")

menu_frame = tk.Frame(menu_window)
menu_frame.pack()

tk.Label(menu_frame, text="N PUZZLE", fg="red", font=("Tahoma", 30, "bold")).grid(
    row=0, column=0, padx=25, pady=25
)

frame = tk.Frame(menu_frame)
frame.grid(row=1, column=0, padx=25, pady=25)

tk.Label(frame, text="ROW Size:", font=("Helvetica", 20, "bold")).grid(
    row=1, column=0, padx=5, pady=5
)
row_combobox = ttk.Combobox(
    frame, values=[2, 3, 4, 5, 6], width=3, font=("Helvetica", 20)
)
row_combobox.grid(row=1, column=1, padx=5, pady=5)
row_combobox.set(3)
row_combobox.state(["readonly"])

tk.Label(frame, text="COL Size:", font=("Helvetica", 20, "bold")).grid(
    row=2, column=0, padx=5, pady=5
)
col_combobox = ttk.Combobox(
    frame, values=[2, 3, 4, 5, 6], width=3, font=("Helvetica", 20)
)
col_combobox.grid(row=2, column=1, padx=5, pady=5)
col_combobox.set(3)
col_combobox.state(["readonly"])

tk.Button(
    menu_frame,
    text="Start!",
    bg="lightgreen",
    font=("Helvetica", 20, "bold"),
    command=start_game,
).grid(row=3, column=0, padx=25, pady=25)

menu_window.mainloop()
