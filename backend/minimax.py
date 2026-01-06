HUMAN = "X"
AI = "O"
EMPTY = ""

def check_winner(board):
    winning_combinations = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ]

    for combo in winning_combinations:
        a, b, c = combo
        if board[a] == board[b] == board[c] and board[a] != EMPTY:
            return board[a]

    if EMPTY not in board:
        return "draw"

    return None


def minimax(board, is_ai_turn, alpha, beta):
    result = check_winner(board)

    if result == AI:
        return 1
    elif result == HUMAN:
        return -1
    elif result == "draw":
        return 0

    if is_ai_turn:
        best_score = -float("inf")
        for i in range(9):
            if board[i] == EMPTY:
                board[i] = AI
                score = minimax(board, False, alpha, beta)
                board[i] = EMPTY
                best_score = max(best_score, score)
                alpha = max(alpha, score)
                if beta <= alpha:
                    break
        return best_score
    else:
        best_score = float("inf")
        for i in range(9):
            if board[i] == EMPTY:
                board[i] = HUMAN
                score = minimax(board, True, alpha, beta)
                board[i] = EMPTY
                best_score = min(best_score, score)
                beta = min(beta, score)
                if beta <= alpha:
                    break
        return best_score


def best_move(board):
    best_score = -float("inf")
    move = None

    for i in range(9):
        if board[i] == EMPTY:
            board[i] = AI
            score = minimax(board, False, -float("inf"), float("inf"))
            board[i] = EMPTY

            if score > best_score:
                best_score = score
                move = i

    return move


if __name__ == "__main__":
    board = [
        "X", "O", "X",
        "X", "O", "",
        "", "", ""
    ]
    print("AI Move:", best_move(board))
