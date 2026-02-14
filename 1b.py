# Function to calculate grade
def calculate_grade(marks):
    if marks >= 90:
        return "A+"
    elif marks >= 80:
        return "A"
    elif marks >= 70:
        return "B"
    elif marks >= 60:
        return "C"
    elif marks >= 50:
        return "D"
    else:
        return "F"


# Function to display result
def display_result(name, marks):
    grade = calculate_grade(marks)
    
    print("Student Name :", name)
    print("Marks        :", marks)
    print("Grade        :", grade)


# ---- Taking input from user ----
name = input("Enter student name: ")
marks = float(input("Enter student marks: "))

# Calling function
display_result(name, marks)
