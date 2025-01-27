import { GroupTitle } from './GroupTitle'
import { TaskListHeader } from './TaskListHeader'

export function GroupHeader({ group, dragHandleProps, shadow }) {
	return (
		<div className="group-header-wrapper full">
			<GroupTitle group={group} dragHandleProps={dragHandleProps} />
			<TaskListHeader groupColor={group.style.color} tasks={group.tasks} shadow={shadow} />
		</div>
	)
}
