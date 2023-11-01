export function employeeStatusBadgeRenderer(employeeStatus: string) {

    var finalStatusClass;
    
    const statusClass = employeeStatus.toLowerCase().replaceAll(' ', '');

    if(statusClass === 'pendingonboard')
    {
        finalStatusClass = 'Pending Foundation';
    }
    else
    {
        finalStatusClass = employeeStatus.replace(/([a-z])([A-Z])/g, '$1 $2');
    }  

    return `
    <span 
        class="rounded-pill employee-status border border-white border-1 fw-normal bg-status-${statusClass} text-status-${statusClass}"  
        style="--bs-bg-opacity: .1;">
        ${finalStatusClass}
    </span>`;
}