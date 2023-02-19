export const URL =
    window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('127.0.0.1')
        ? 'http://localhost:3001/api'
        : 'our own address'

export const templateURL =
    window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('127.0.0.1')
        ? 'http://localhost:3001'
        : 'our own address'