import { useSelector } from "react-redux";
import { makeId } from "../services/util.service";

export function GroupSummary({ group, cmpsOrder }){

    const statusLabels = useSelector(storeState => storeState.boardModule.board.statusLabels)
    const priorityLabels = useSelector(storeState => storeState.boardModule.board.priorityLabels)
    
    const accumulator = {}
    cmpsOrder.forEach(cmp => {
        const newStr = cmp.toLowerCase().replace('picker', 'Summary')
        if (newStr.startsWith('status') || newStr.startsWith('priority')) {
            accumulator[newStr] = {}
        } else accumulator[newStr] = []
    })

        const { tasks } = group
        const groupSummary = tasks.reduce(addToAcc, accumulator)
        const groupSummaryArray = summaryIntoArray(groupSummary) 


    function addToAcc(acc, task) {
        const { dateSummary, statusSummary, prioritySummary, timelineSummary, memberSummary } = acc
        const { dueDate, status, priority, timeline, members, } = task

        for (const field in task) {
            switch (field) {
                case 'status':
                    if (!statusSummary[status]) statusSummary[status] = 1
                    else statusSummary[status] ++
                    break;
                case 'priority':
                    if (!prioritySummary[priority]) prioritySummary[priority] = 1
                    else prioritySummary[priority] ++
                    break;
                case 'timeline':
                    if (timeline) timelineSummary.push(timeline)
                    break;
                case 'dueDate':
                    if (dueDate) dateSummary.push(dueDate)
                    break;
                case 'members':
                    if (members.length) memberSummary.push(structuredClone(members))
                    break;
            
                default:
                    break;
            }
        }

        return acc
    }

    function summaryIntoArray(summary) {
        let { dateSummary, timelineSummary, memberSummary} = summary

        const memberIds = []
        const filteredMemberSummary = memberSummary.flat().filter(summary => {
            if ( !memberIds.includes(summary._id)) {
                memberIds.push(summary._id)
                return true
            } else return false
        })

        if (dateSummary.length >= 2) {
            dateSummary.sort((a, b) => a - b)
            summary.dateSummary = {
                start: dateSummary[0],
                end: dateSummary.at(-1),
            }
        } else if (dateSummary.length === 1) {
            summary.dateSummary = {
                start: dateSummary[0],
                end: dateSummary[0],
            }
        } else summary.dateSummary = {}

        const times = timelineSummary.flatMap(time => Object.values(time))
        if (times.length >= 2) {
            times.sort((a, b) => a - b)
            summary.timelineSummary = {
                start: times[0],
                end: times.at(-1),
            }
        } else if (times.length === 1) {
            summary.timelineSummary = {
                start: times[0],
                end: times[0],
            }
        } else summary.timelineSummary = {}

        const res = []
        for (const field in summary){
            res.push({ [field]: summary[field]})
        }    

        return res
    }

    return (
        <section className="group-summary full">
            {groupSummaryArray.map(summary => (
                    <DynamicSummaryCmp padding={8} summary={summary} statusLabels={statusLabels} priorityLabels={priorityLabels} />
            ))}
        </section>
    )
}

function DynamicSummaryCmp( props ){
    const field  = Object.keys(props.summary)[0]

    switch (field) {
        case 'dateSummary':
            
            return <DateSummary {...props} />
        case 'statusSummary':
            
            return <StatusSummary {...props} />
        case 'prioritySummary':
            
            return <PrioritySummary {...props} />
        case 'timelineSummary':
                
            return <TimelineSummary {...props} />
        case 'memberSummary':
            
            return <MemberSummary {...props} />
    
        default:
            break;
    }

    return (
        <h1>test</h1>
    )
}

function StatusSummary({ summary, statusLabels, padding }){

    const width = 140
    let total = 0

    const { statusSummary } = summary
    const summaryForRender = []

    for (const field in statusSummary) {
        total += statusSummary[field]
        statusLabels.find(label => {
            if (label.id === field) {
                summaryForRender.push({ id: label.id, color: label.color, size: statusSummary[field]})
            }
        })
    }

    summaryForRender.sort((a, b) => a.id.localeCompare(b.id))
    const unit = (width - (padding * 2) )/ total

    return (
        <section style={{ width: width + 'px'}} className="status-summary summary">
            {summaryForRender.map(summary => (
                <div 
                    className="summary-colored-block" 
                    key={makeId()} 
                    style={{ backgroundColor: summary.color, width: (unit * summary.size) + 'px'}}>
                </div>
            ))}
        </section>
    )
}

function PrioritySummary({ summary, priorityLabels, padding }){

    const width = 140
    let total = 0

    const { prioritySummary } = summary
    const summaryForRender = []

    for (const field in prioritySummary) {
        total += prioritySummary[field]
        priorityLabels.find(label => {
            if (label.id === field) {
                summaryForRender.push({ id: label.id, color: label.color, size: prioritySummary[field]})
            }
        })
    }

    summaryForRender.sort((a, b) => a.id.localeCompare(b.id))
    const unit = (width - (padding * 2) )/ total

    return (
        <section style={{ width: width + 'px'}} className="priority-summary summary">
            {summaryForRender.map(summary => (
                <div 
                    className="summary-colored-block" 
                    key={makeId()} 
                    style={{ backgroundColor: summary.color, width: (unit * summary.size) + 'px'}}>
                </div>
            ))}
        </section>
    )
}

function DateSummary({ summary, padding }){

    const { dateSummary } = summary
    const width = 140
    console.log(dateSummary)

    if (!dateSummary.start) {
        return (
            <section style={{ width: width + 'px'}} className="date-summary summary">
                <div style={{width: width - (padding * 4)}} className="empty">
                    -
                </div>
            </section>
    )} else if (dateSummary.start === dateSummary.end) {
        return (
        <section style={{ width: width + 'px'}} className="date-summary summary">
            <h1>
                date
            </h1>
        </section>
    )} else return (
        <section style={{ width: width + 'px'}} className="date-summary summary">
            <h1>
                date
            </h1>
        </section>
    )
}

function MemberSummary({ summary }){

    const width = 97
    return (
        <section style={{ width: width + 'px'}} className="member-summary summary">
            <h1>
                member
            </h1>
        </section>
    )
}

function TimelineSummary({ summary }){

    const width = 140
    return (
        <section style={{ width: width + 'px'}} className="timeline-summary summary">
            <h1>
                timeline
            </h1>
        </section>
    )
}