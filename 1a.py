class Student:
    
    # Constructor method (runs automatically when object is created)
    def __init__(self, name, marks):
        self.name = name      # Store student name
        self.marks = marks    # Store student marks

    # Method to calculate grade
    def calculate_grade(self):
        if self.marks >= 90:
            return "A+"
        elif self.marks >= 80:
            return "A"
        elif self.marks >= 70:
            return "B"
        elif self.marks >= 60:
            return "C"
        elif self.marks >= 50:
            return "D"
        else:
            return "F"

    # Method to display result
    def display(self):
        grade = self.calculate_grade()
        print("Student Name :", self.name)
        print("Marks        :", self.marks)
        print("Grade        :", grade)


# ---- Taking input from user ----
name = input("Enter student name: ")
marks = float(input("Enter student marks: "))

# Creating object of class
student1 = Student(name, marks)

# Display result
student1.display()
