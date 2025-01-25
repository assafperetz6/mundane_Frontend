

export function DateSummary({ summary, padding, group }){

    const { dateSummary } = summary
    const width = 140

    if (!dateSummary.start) {
        return (
            <section style={{ width: width + 'px'}} className="summary">
                <div style={{width: width - (padding * 4)}} className="date-summary empty">
                    -
                </div>
            </section>
    )} else if (dateSummary.start === dateSummary.end) {

        const date = new Date(dateSummary.start).toString()
        const dayStr = (date.substring(8, 10).startsWith('0')) ? date.substring(9, 10) : date.substring(8, 10)
        const dateStr = dayStr + ' ' + date.substring(4, 7)
        const bgc = Date.now() < dateSummary.start ? '#333333' : group.style.color 

        return (
        <section style={{ width: width + 'px'}} className="summary">
            <div style={{width: width - (padding * 4), backgroundColor: bgc}} className="date-summary">
                <span className="normal-view">{dateStr}</span> <span className="hover-view">1d</span>
            </div>
        </section>
    )} else {

        const startDate = new Date(dateSummary.start).toDateString().substring(4)
        const startYear = startDate.substring(7)
        const startMonth = startDate.substring(0, 3)
        const startDay = (startDate.substring(4, 6).startsWith('0')) ? startDate.substring(5, 6) : startDate.substring(4, 6)
        
        const endDate = new Date(dateSummary.end).toDateString().substring(4)
        const endYear = endDate.substring(7)
        const endMonth = endDate.substring(0, 3)
        const endDay = (endDate.substring(4, 6).startsWith('0')) ? endDate.substring(5, 6) : endDate.substring(4, 6)

        const currYear = new Date().getFullYear() + ''

        let dateRange

        if (startYear === currYear && endYear === currYear) {
            if (startMonth === endMonth) {
                dateRange = `${startDay} - ${endDay} ${startMonth}`
            } else {
                dateRange = `${startDay} ${startMonth} - ${endDay} ${endMonth}`
            }
        } else if (startYear === endYear) {
            if (startMonth === endMonth) {
                dateRange = `${startDay} - ${endDay} ${startMonth} ${startYear}`
            } else {
                dateRange = `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`
            }
        } else {
            dateRange = `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`
        }

        const daysStr = (dateSummary.end - dateSummary.start) / 86400000 + 1 + 'd' // 86400000 is the number of milliseconds in a day

        function getProgressStyle() {
            if (!dateSummary.start || !dateSummary.end) return {}
    
            const now = Date.parse(new Date().toDateString())
            const startDate = new Date(dateSummary.start).getTime()
            const endDate = new Date(dateSummary.end).getTime()
    
            const totalDuration = endDate - startDate
            const timeElapsed = now - startDate
            let percentComplete = (timeElapsed / totalDuration) * 100
            percentComplete = Math.max(0, Math.min(100, percentComplete))
    
            return `
                linear-gradient(to left, #333333 ${100 - percentComplete}%, 
                ${group.style.color} ${100 - percentComplete}%)
            `
        }    

        return (
        <section style={{ width: width + 'px'}} className="summary">
            <div style={{width: width - (padding * 4), background: getProgressStyle()}} className="date-summary">
                <span style={{textOverflow: "ellipsis"}} className="normal-view">{dateRange}</span> <span className="hover-view">{daysStr}</span>
            </div>
        </section>
    )}
}