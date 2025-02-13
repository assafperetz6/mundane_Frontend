import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { loadBoards, addBoard, updateBoard, removeBoard } from '../store/actions/board.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { boardService } from '../services/board/'
import { userService } from '../services/user'
import { BoardList } from '../cmps/BoardList'

export function BoardIndex() {
	const boards = useSelector(storeState => storeState.boardModule.boards)

	useEffect(() => {
		loadBoards()
	}, [])

	async function onRemoveBoard(boardId) {
		try {
			await removeBoard(boardId)
			showSuccessMsg('Board removed')
		} catch (err) {
			showErrorMsg('Cannot remove board')
		}
	}

	async function onAddBoard() {
		const board = boardService.getEmptyBoard()
		board.title = prompt('Title?')
		try {
			const savedBoard = await addBoard(board)
			showSuccessMsg(`Board added (id: ${savedBoard._id})`)
		} catch (err) {
			showErrorMsg('Cannot add board')
		}
	}

	async function onUpdateBoard(board) {
		const title = prompt('New title?', board.title)
		if (title === '0' || title === board.title) return

		const boardToSave = { ...board, title }
		try {
			const savedBoard = await updateBoard(boardToSave)
			showSuccessMsg(`Board updated, new title: ${savedBoard.title}`)
		} catch (err) {
			showErrorMsg('Cannot update board')
		}
	}

	return (
		<main className="board-index">
			<header>
				<h2>Boards</h2>
			</header>
			<BoardList boards={boards} onRemoveBoard={onRemoveBoard} onUpdateBoard={onUpdateBoard} />
		</main>
	)
}
