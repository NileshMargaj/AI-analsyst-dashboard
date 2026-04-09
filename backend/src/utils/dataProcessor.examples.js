/**
 * DATA PROCESSOR - USAGE EXAMPLES
 * 
 * This file demonstrates how to use the data processor utility
 * with real-world examples for an analytics dashboard.
 */

import {
    getColumns,
    getRows,
    getSchema,
    filterData,
    applyMultipleFilters,
    groupBy,
    groupByMultiple,
    sortData,
    sortByMultiple,
    sum,
    average,
    min,
    max,
    count,
    countDistinct,
    analyzeData,
    analyzeDataAdvanced,
    processQuery,
    summarize,
    paginate,
    getUnique,
    fillMissing
} from './dataProcessor.js';

// ============================================================================
// SAMPLE DATA (representing uploaded CSV)
// ============================================================================

const sampleEmployeeData = [
    { id: 1, name: 'Alice', department: 'IT', salary: 50000, joinDate: '2021-03-15' },
    { id: 2, name: 'Bob', department: 'HR', salary: 40000, joinDate: '2020-07-22' },
    { id: 3, name: 'Charlie', department: 'IT', salary: 55000, joinDate: '2021-11-05' },
    { id: 4, name: 'Diana', department: 'Sales', salary: 45000, joinDate: '2022-01-10' },
    { id: 5, name: 'Eve', department: 'IT', salary: 60000, joinDate: '2020-05-18' },
    { id: 6, name: 'Frank', department: 'HR', salary: 42000, joinDate: '2022-04-03' },
    { id: 7, name: 'Grace', department: 'Sales', salary: 48000, joinDate: '2021-08-12' },
    { id: 8, name: 'Henry', department: 'IT', salary: null, joinDate: '2023-02-20' } // Missing salary
];

// ============================================================================
// EXAMPLE 1: COLUMN & ROW EXTRACTION
// ============================================================================

console.log('\n=== EXAMPLE 1: Column & Row Extraction ===');

// Get all columns
const columns = getColumns(sampleEmployeeData);
console.log('Columns:', columns);
// Output: ['id', 'name', 'department', 'salary', 'joinDate']

// Get schema with data types
const schema = getSchema(sampleEmployeeData);
console.log('Schema:', schema);
// Output: { id: 'number', name: 'string', department: 'string', salary: 'number', joinDate: 'date' }

// Get rows
const rows = getRows(sampleEmployeeData);
console.log('Row count:', rows.length);
// Output: 8

// ============================================================================
// EXAMPLE 2: FILTERING
// ============================================================================

console.log('\n=== EXAMPLE 2: Filtering ===');

// Single filter: Find employees in IT department
const itEmployees = filterData(sampleEmployeeData, 'department', '=', 'IT');
console.log('IT Employees:', itEmployees.length);
// Output: 4

// Find employees with salary > 50000
const highEarners = filterData(sampleEmployeeData, 'salary', '>', 50000);
console.log('High earners (>50k):', highEarners.length);
// Output: 2

// Contains filter: Find names containing 'a'
const namesWithA = filterData(sampleEmployeeData, 'name', 'contains', 'a');
console.log('Names with "a":', namesWithA.map(e => e.name));
// Output: ['Diana', 'Grace']

// Multiple filters: IT department AND salary > 50000
const highEarningITStaff = applyMultipleFilters(sampleEmployeeData, [
    { field: 'department', operator: '=', value: 'IT' },
    { field: 'salary', operator: '>', value: 50000 }
]);
console.log('High-earning IT staff:', highEarningITStaff.length);
// Output: 2

// ============================================================================
// EXAMPLE 3: GROUPING
// ============================================================================

console.log('\n=== EXAMPLE 3: Grouping ===');

// Group by department
const byDepartment = groupBy(sampleEmployeeData, 'department');
console.log('Grouped by department:', Object.keys(byDepartment));
// Output: ['IT', 'HR', 'Sales']

console.log('IT department count:', byDepartment['IT'].length);
// Output: 4

// Group by multiple fields
const byDeptAndRole = groupByMultiple(sampleEmployeeData, ['department']);
console.log('Department groups:', Object.keys(byDeptAndRole));

// ============================================================================
// EXAMPLE 4: SORTING
// ============================================================================

console.log('\n=== EXAMPLE 4: Sorting ===');

// Sort by salary descending
const sortedBySalary = sortData(sampleEmployeeData, 'salary', 'desc');
console.log('Top 3 earners:');
sortedBySalary.slice(0, 3).forEach(emp => {
    console.log(`  ${emp.name}: ${emp.salary}`);
});
// Output: Eve: 60000, Charlie: 55000, Alice: 50000

// Sort by name ascending
const sortedByName = sortData(sampleEmployeeData, 'name', 'asc');
console.log('First 3 by name:', sortedByName.slice(0, 3).map(e => e.name));
// Output: ['Alice', 'Bob', 'Charlie']

// Sort by multiple fields
const multiSort = sortByMultiple(sampleEmployeeData, [
    { field: 'department', order: 'asc' },
    { field: 'salary', order: 'desc' }
]);
console.log('First 3 (dept asc, then salary desc):', 
    multiSort.slice(0, 3).map(e => `${e.department}-${e.salary}`));

// ============================================================================
// EXAMPLE 5: METRICS & AGGREGATIONS
// ============================================================================

console.log('\n=== EXAMPLE 5: Metrics & Aggregations ===');

// Sum of all salaries
const totalSalary = sum(sampleEmployeeData, 'salary');
console.log('Total salary bill:', totalSalary);
// Output: 340000

// Average salary
const avgSalary = average(sampleEmployeeData, 'salary');
console.log('Average salary:', avgSalary);
// Output: 42500

// Min and max salary
const minSalary = min(sampleEmployeeData, 'salary');
const maxSalary = max(sampleEmployeeData, 'salary');
console.log(`Salary range: ${minSalary} - ${maxSalary}`);
// Output: Salary range: 40000 - 60000

// Count total and distinct departments
const totalEmployees = count(sampleEmployeeData);
const distinctDepts = countDistinct(sampleEmployeeData, 'department');
console.log(`Total employees: ${totalEmployees}, Departments: ${distinctDepts}`);
// Output: Total employees: 8, Departments: 3

// ============================================================================
// EXAMPLE 6: ADVANCED ANALYSIS
// ============================================================================

console.log('\n=== EXAMPLE 6: Advanced Analysis ===');

// Analyze salary by department
const salaryByDept = analyzeData(sampleEmployeeData, 'department', 'salary');
console.log('Salary analysis by department:', JSON.stringify(salaryByDept, null, 2));
/*
Output:
{
  IT: { count: 4, sum: 220000, average: 55000, min: 50000, max: 60000 },
  HR: { count: 2, sum: 82000, average: 41000, min: 40000, max: 42000 },
  Sales: { count: 2, sum: 93000, average: 46500, min: 45000, max: 48000 }
}
*/

// Advanced analysis with multiple metrics
const advancedAnalysis = analyzeDataAdvanced(
    sampleEmployeeData,
    'department',
    [
        { type: 'count', field: 'id' },
        { type: 'sum', field: 'salary' },
        { type: 'average', field: 'salary' }
    ]
);
console.log('Advanced metrics:', JSON.stringify(advancedAnalysis, null, 2));

// ============================================================================
// EXAMPLE 7: COMPLEX QUERY PROCESSING (BONUS)
// ============================================================================

console.log('\n=== EXAMPLE 7: Complex Query Processing ===');

// Query 1: Find IT employees and get average salary
const query1Result = processQuery(sampleEmployeeData, {
    filter: { field: 'department', operator: '=', value: 'IT' },
    metric: { type: 'average', field: 'salary' }
});
console.log('Query 1 - Average IT salary:', query1Result);

// Query 2: Complex query with filtering, grouping, sorting, and metrics
const query2Result = processQuery(sampleEmployeeData, {
    filter: [
        { field: 'salary', operator: '>', value: 40000 }
    ],
    groupBy: 'department',
    metric: [
        { type: 'count', field: 'id' },
        { type: 'average', field: 'salary' }
    ],
    sort: [{ field: 'average_salary', order: 'desc' }],
    limit: 10
});
console.log('Query 2 - Complex analysis:', JSON.stringify(query2Result, null, 2));

// Query 3: With pagination
const query3Result = processQuery(sampleEmployeeData, {
    filter: [
        { field: 'salary', operator: '>=', value: 40000 }
    ],
    sort: [{ field: 'salary', order: 'desc' }],
    limit: 3,
    offset: 0
});
console.log('Query 3 - Top 3 earners (>40k):', query3Result.data);

// ============================================================================
// EXAMPLE 8: UTILITY FUNCTIONS
// ============================================================================

console.log('\n=== EXAMPLE 8: Utility Functions ===');

// Get summary statistics for salary field
const salarySummary = summarize(sampleEmployeeData, 'salary');
console.log('Salary summary:', salarySummary);
/*
Output:
{
  field: 'salary',
  type: 'number',
  count: 7,
  total: 7,
  missing: 1,
  sum: 340000,
  average: 48571.42,
  min: 40000,
  max: 60000,
  distinct: 7
}
*/

// Get unique departments
const uniqueDepts = getUnique(sampleEmployeeData, 'department');
console.log('Unique departments:', uniqueDepts);
// Output: ['IT', 'HR', 'Sales']

// Paginate results
const page1 = paginate(sampleEmployeeData, 1, 3);
console.log(`Page 1 of ${page1.totalPages}:`, page1.data.map(e => e.name));
// Output: Page 1 of 3: ['Alice', 'Bob', 'Charlie']

// Fill missing values
const filledData = fillMissing(sampleEmployeeData, 'salary', 47000);
console.log('Henry\'s salary after filling:', filledData[7].salary);
// Output: 47000

// ============================================================================
// EXAMPLE 9: REAL-WORLD DASHBOARD USE CASE
// ============================================================================

console.log('\n=== EXAMPLE 9: Dashboard Use Case ===');

// Scenario: Build a dashboard showing top-earning departments with employee count

const dashboardQuery = processQuery(sampleEmployeeData, {
    filter: { field: 'salary', operator: '>', value: 40000 }, // Exclude low earners
    groupBy: 'department',
    metric: [
        { type: 'count', field: 'id' },
        { type: 'average', field: 'salary' },
        { type: 'sum', field: 'salary' }
    ],
    sort: [{ field: 'sum_salary', order: 'desc' }]
});

console.log('Dashboard - Top Departments by Salary:');
console.log(JSON.stringify(dashboardQuery.data, null, 2));

// ============================================================================
// EXPORT FOR TESTING
// ============================================================================

export {
    sampleEmployeeData
};
