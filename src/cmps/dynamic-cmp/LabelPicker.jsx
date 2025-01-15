import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { showErrorMsg } from '../../services/event-bus.service'
import { usePopper } from 'react-popper'
import { useEffectUpdate } from '../../customHooks/useEffectUpdate'
import { updateBoard } from '../../store/actions/board.actions'
import { svgs } from '../../services/svg.service'

export function LabelPicker({ cmp, task, groupId, defaultWidth }) {
	const [isPickerOpen, setIsPickerOpen] = useState(false)
	const [label, setLabel] = useState({})
	const [labelsName, setLabelsName] = useState('')
	// const [isEditing, setIsEditing] = useState(false)
	const board = useSelector(storeState => storeState.boardModule.board)
	const dispatch = useDispatch()

	const [referenceElement, setReferenceElement] = useState(null)
	const [popperElement, setPopperElement] = useState(null)
	const [arrowElement, setArrowElement] = useState(null)
	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		modifiers: [
			{ name: 'arrow', options: { element: arrowElement } },
			{ name: 'offset', options: { offset: [0, 8] } }
		]
	})

	useEffect(() => {
		if (cmp === 'StatusPicker') {
			setLabelsName('statusLabels')
		} else if (cmp === 'PriorityPicker') {
			setLabelsName('priorityLabels')
		}
	}, [task, cmp])

	useEffect(() => {
		document.addEventListener('mousedown', onPickerClose)
		return () => {
			document.removeEventListener('mousedown', onPickerClose)
		}
	}, [])

	useEffectUpdate(() => {
		const labelId = cmp === 'StatusPicker' ? task.status : task.priority
		const label = board[labelsName]?.find(l => l.id === labelId)

		setLabel(label)
	}, [labelsName, board])

	function onPickerClose(ev) {
		if (!ev.target.closest('.label-picker-popup')) {
			setIsPickerOpen(false)
			// setIsEditor(false)
		}
	}

	function handleClick() {
		setIsPickerOpen(true)
	}
	async function onChangeLabel(ev, newLabel) {
		ev.stopPropagation()
		setIsPickerOpen(false)

		try {
			const labelTaskName = labelsName === 'statusLabels' ? 'status' : 'priority'
			const updatedBoard = {
				...board,
				groups: board.groups.map(group => {
					if (group.id === groupId) {
						return {
							...group,
							tasks: group.tasks.map(t => {
								if (t.id === task.id) {
									return {
										...t,
										[labelTaskName]: newLabel.id
									}
								}
								return t
							})
						}
					}
					return group
				})
			}

			console.log(board)

			try {
				await updateBoard(updatedBoard)
				setLabel(newLabel)
			} catch (err) {
				console.error('Dispatch error:', err)
				throw err
			}
		} catch (error) {
			console.error('Failed to update label:', error)
			showErrorMsg('Cannot change label')
		}
	}

	return (
		<li style={{ backgroundColor: label?.color || '#C4C4C4', width: defaultWidth }} className="label-picker" ref={setReferenceElement} onClick={handleClick}>
			<span>{label?.title || ''}</span>
			<div className="corner-fold"></div>
			{isPickerOpen && <LabelPickerPopUp popperRef={setPopperElement} board={board} labelsName={labelsName} onChangeLabel={onChangeLabel} label={label} styles={styles} setArrowElement={setArrowElement} attributes={attributes} />}
		</li>
	)
}

function LabelPickerPopUp({ board, labelsName, onChangeLabel, setIsEditor, styles, popperRef, setArrowElement, attributes }) {
	return (
		<div className="label-picker-popup" ref={popperRef} style={styles.popper} {...attributes.popper}>
			<div className="modal-up-arrow" ref={setArrowElement} style={styles.arrow}></div>
			<ul className="labels-list clean-list">
				{board[labelsName].map(label => (
					<li key={label.id} style={{ backgroundColor: label.color }} onClick={ev => onChangeLabel(ev, label)}>
						{label.title}
					</li>
				))}
			</ul>
			<div className="separator"></div>
			<button className="edit-labels" onClick={console.log('edit')}>
				<span className="icon">{svgs.pencil}</span>
				<span className="title">Edit Labels</span>
			</button>
		</div>
	)
}
