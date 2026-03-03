export function instaTimeAgo(date) {

    const seconds = Math.floor(
        (new Date() - new Date(date)) / 1000
    )
    const intervals = [
        { label: "years ago", seconds: 31536000},
        { label: "weeks ago", seconds: 604800},
        { label: "days ago", seconds: 86400},
        { label: "hour ago", seconds: 3600},
        { label: "minutes ago", seconds: 60},
    ]

    for (let i of intervals){
        const count = Math.floor(seconds / i.seconds)
        if(count >= 1) return count  + i.label
    }

    return "Just now"
}

export const formatMessageTime = (date) => {
    const d = new Date(date)
    return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    })
}

export const formatDateSeparator = (date) => {
    const messageDate = new Date(date)
    const today = new Date()

    const isToday = messageDate.toDateString() === today.toDateString()

    const yesterday = new Date()
    yesterday.setDate(today.getDate() -1)

    const isYesterday = messageDate.toDateString() === yesterday.toDateString()

    if(isToday) return "Today"
    if (isYesterday) return "Yesterday"

    return messageDate.toLocaleDateString([], {
        day: "numeric",
        month: "long",
        year:"numeric"
    })
}