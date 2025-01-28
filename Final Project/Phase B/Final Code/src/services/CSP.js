
export default class ClassroomCSP {
    constructor(rows, seatsPerRow, students,apiKey) {
        this.apiKey=apiKey;
        this.rows = rows;
        this.seatsPerRow = seatsPerRow;
        this.students = students;
        this.noResponsesStudents = [];
        this.seating = Array.from({ length: rows }, () => Array(seatsPerRow).fill(null));
    }

    // Reset the seating matrix
    resetSeating() {
        this.seating = Array.from({ length: this.rows }, () => Array(this.seatsPerRow).fill(null));
    }

     async callGPT4Turbo(prompt) {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-4-turbo',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant for analyzing teacher notes.' },
                        {
                            role: 'user',
                            content: `
                                Analyze the following note:
                                "${prompt}".
                                Output only the numeric values for:
                                Behavioral Score, Academic Support Score, Seating Adjustment.

                                Use this format:
                                <Behavioral Score>, <Academic Support Score>, <Requires Assistance>
                              `
                        }
                    ],
                    max_tokens: 100,
                    temperature: 0.7,
                }),
            });
    
            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Error ${response.status}: ${errorDetails.error.message}`);
            }
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return {
                behavioralScore: 3, // Neutral as default
                academicSupportScore: 0, // No support as default
                requiresAssistance: 0, // No preference as default
            };
        }
    }
    
    splitByResponses() { // No parameter needed since we're using this.students
     const withResponses = this.students.filter(obj => obj.responses);
      this.noResponsesStudents = this.students.filter(obj => !obj.responses); 
      this.students = withResponses; } // Update the original students array 


    async preprocessStudents() {
        for (let student of this.students) {
            // Map academic level responses to scores
            const academicLevelScore = {
                "Exceptional": 5,
                "Above average": 4,
                "Average": 3,
                "Below average": 2,
                "Needs significant support": 1,
            }[student.responses?.academicLevel || "Average"];
    
            // Map behavior responses to scores
            const behaviorScore = {
                "Exemplary behavior": 1,
                "Positive influence": 2,
                "Neutral": 3,
                "Occasionally disruptive": 4,
                "Disruptive": 5,
            }[student.responses?.behavior || "Neutral"];
    
            // Map assistance field
            const assistanceScore = student.responses["Academic Performance"]["Requires assistance?"] ? 2 : 0;
    
            
            const gptResponse = student.responses?.["Additional Insights"]?.["Other notes"] 
            ? await this.callGPT4Turbo(student.responses["Additional Insights"]["Other notes"]) 
            : "3, 0, 0";
            // Parse GPT response into scores
            const [behavioralAdjustment, academicSupportAdjustment, requiresAssistance] = gptResponse.split(",").map(str => (!isNaN(str) && str.trim() !== '' ? Number(str) : 0)).concat([0, 0, 0]) // Ensure there are at least 3 elements
            .slice(0, 3); // Keep only the first 3 elements
    
            // Calculate the total priority score
            student.priorityScore =
                -academicLevelScore +
                behaviorScore +
                assistanceScore +
                behavioralAdjustment 
                -academicSupportAdjustment +
                requiresAssistance;
    
            // Store parsed notes for reference
            student.parsedNotes = {
                behavioralAdjustment,
                academicSupportAdjustment,
                requiresAssistance,
            };
            if (student.specialNeeds === "Yes") { 
                if(student.priorityScore>0) {

                    student.priorityScore *= 1.5;
                }else   {
                    student.priorityScore +=0.5*((-1)*student.priorityScore);
                }
            }
        }


        // Sort students based on their priority score
        this.students.sort((a, b) => b.priorityScore - a.priorityScore);
        console.log("in preproccess****",this.students);
    }
    
    async RegenerateSeating(studentMatrix, previousFeedback = "") {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-4-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: ` You are a classroom seating arrangement assistant. Your task is to optimize student seating based on academic performance, special needs, and interpersonal dynamics. Return only a 5x8 matrix of student names in the optimal arrangement.`
                        },
                        {
                            role: 'user',
                            content: `
                                Given this 5x8 classroom layout, create an optimal seating arrangement based on these student details:
                                ${JSON.stringify(this.seating)}
                                
                                Consider these factors for each student:
                                1. Academic Performance: Higher performing students should be distributed to enable peer support
                                2. Special Needs: Ensure appropriate accommodations (front seats for visual/auditory needs)
                                3. Student Interactions: Consider "avoid" preferences to prevent disruptive combinations
                                
                                Previous Feedback to incorporate:
                                ${previousFeedback} make sure special needs students are seated always in the first two rows!!
                                its not necessary to seat all special needs in the same row or in the first seatings, only make sure they sorted based on priority score and if special needs student should be replaced replace him sith the lowest non-special needs student in the first two rows!!
                                make sure to avoid students if any related information given!
                                make sure for the most important thing! always check before giving the final matrix if there are no duplicated students**
                                *** Output only the Matrix ***
                                Return ONLY a 5x8 matrix of student names in this format:
                                [
                                    ["Name1", "Name2", ..., "Name8"],
                                    ["Name1", "Name2", ..., "Name8"],
                                    ["Name1", "Name2", ..., "Name8"],
                                    ["Name1", "Name2", ..., "Name8"],
                                    ["Name1", "Name2", ..., "Name8"]
                                ]
                                    **If you didnt place any student in a cell then write null
                                    don't add any introductions just give me the answer!!!!!!!
                            `
                        }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7,
                }),
            });
    
            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(` Error ${response.status}: ${errorDetails.error.message}`);
            }
    
            const data = await response.json();
            return JSON.parse(data.choices[0].message.content);
    
        } catch (error) {
            console.error(` Error: ${error}`);
            return studentMatrix; // Return original arrangement if there's an error
        }
    }

    createNewSeatingArrangement(nameMatrix, originalSeating) {
        // Create a map of names to their original student objects
        const studentMap = new Map();
        
        // Populate the map with student objects from original seating
        originalSeating.forEach(row => {
            row.forEach(student => {
                if (student && student.name) {
                    studentMap.set(student.name, student);
                }
            });
        });
    
        // Create new seating arrangement based on the name matrix
        return nameMatrix.map(row => {
            return row.map(name => {
                if (!name || name === "null") return null;
                return studentMap.get(name) || null; // Return the original student object or null if not found
            });
        });
    }

    
   

    // Place a student in specific rows
    placeStudentInRow(student, rows) {
        for (let row of rows) {
            for (let seat = 0; seat < this.seatsPerRow; seat++) {
                if (this.seating[row][seat] === null && this.isValidPlacement(student, row, seat)) {
                    this.seating[row][seat] = student;
                    return true;
                }
            }
        }
        return false;
    }

    // Place student anywhere as a fallback
    placeStudentAnywhere(student) {
        for (let row = 0; row < this.rows; row++) {
            for (let seat = 0; seat < this.seatsPerRow; seat++) {
                if (this.seating[row][seat] === null && this.isValidPlacement(student, row, seat)) {
                    this.seating[row][seat] = student;
                    return true;
                }
            }
        }
        return false;
    }

    // Check if placement is valid based on constraints
    isValidPlacement(student, row, seat) {
        const directions = [
            [0, -1], [0, 1], [-1, 0], [1, 0],
            [-1, -1], [-1, 1], [1, -1], [1, 1],
        ];

        for (let [dx, dy] of directions) {
            const newRow = row + dx;
            const newSeat = seat + dy;

            if (
                newRow >= 0 &&
                newRow < this.rows &&
                newSeat >= 0 &&
                newSeat < this.seatsPerRow &&
                this.seating[newRow][newSeat]
            ) {
                const neighbor = this.seating[newRow][newSeat];
                if(student.responses["Behavioral and Social Traits"]["Students to avoid"] && neighbor.responses["Behavioral and Social Traits"]["Students to avoid"]){

                    if (student.responses["Behavioral and Social Traits"]["Students to avoid"].includes(neighbor.id) || neighbor.responses["Behavioral and Social Traits"]["Students to avoid"].includes(student.id)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    createSeatingMatrix() {
        
        const sortedStudents = [...this.students].sort((a, b) => b.score - a.score);
        const matrix = Array.from({ length: this.rows }, () => Array(this.seatsPerRow).fill(null));

         let index = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.seatsPerRow; col++) {
                matrix[row][col] = sortedStudents[index];
                index++;
            }
        }
        
        return matrix;
    }

    // shiftStudentsToFront() {
    //     // Create a flat array of all students from the matrix
    //     const allStudents = this.seating.flat().filter(student => student !== null);
        
    //     // Reset the matrix
    //     this.resetSeating();
        
    //     // Place students back in sequential order
    //     let studentIndex = 0;
    //     for (let row = 0; row < this.rows; row++) {
    //         for (let seat = 0; seat < this.seatsPerRow; seat++) {
    //             if (studentIndex < allStudents.length) {
    //                 this.seating[row][seat] = allStudents[studentIndex];
    //                 studentIndex++;
    //             } else {
    //                 this.seating[row][seat] = null;
    //             }
    //         }
    //     }
    // }
    
 
    
    
    // Solve the seating arrangement
    async solve(feedback="") {
        this.resetSeating();
        this.splitByResponses();
        await this.preprocessStudents();
        // this.assignFrontRows();
        const matrix=this.createSeatingMatrix();
        // this.shiftStudentsToFront();
        
        if(feedback!==""){
            const newSeatingString=await this.RegenerateSeating(this.seating,feedback);
            this.seating=this.createNewSeatingArrangement(newSeatingString,this.seating);
        }
        console.log(this.seating);
        return matrix;
    }
}


