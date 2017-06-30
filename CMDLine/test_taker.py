import sys
import pprint
import random
import pdb

#This is the raw json received as part of the requirements
test={"quiz":{"q1":{"question":"The Alamo, site of the famous battle, is a tourist attraction in what Texas city?","options":["Austin","Houston","San Antonio","Brownsville"],"answer":"3"},"q2":{"question":"As the crow flies, which of the following pairs of cities are fewer than 5,000 miles apart?","options":["Cape Town and London","Hong Kong and Honolulu","Mexico City and Paris","Moscow and Washington"],"answer":"4"},"q3":{"question":"Which of the three following states showed a growth in population from 1980 to 1990?","options":["Iowa","West Virginia","Vermont"],"answer":"3"},"q4":{"question":"Which one of the following names was not a name of the city of Leningrad?","options":["Petrograd","St. Petersburg","Stalingrad"],"answer":"3"},"q5":{"question":"What is the postal abbreviation for Alaska?","options":["AA","AL","AK","AS"],"answer":"3"}}}
#Get all the questions from the above json
questions=test["quiz"]

"""
The Question Object holds all the properties of a question JSONObject which has the following schema:

{
  "question":"The Alamo, site of the famous battle, is a tourist attraction in what Texas city?",
  "options":["Austin","Houston","San Antonio","Brownsville"],
  "answer":"3"
}

"""
class Question:
    label=""
    question=""
    options=[]
    answer=0
    #constructor that initializes all the class properties accordingly
    def __init__(self,lab,ques,opt,answ):
        self.label=lab
        self.question=ques
        self.options=opt
        self.answer=answ 

    #method that prints all the options for a given question
    def print_options(self):
        counter=1
        for an_option in self.options:
            print counter, ". ", an_option
            counter +=1
"""
The Answer Object abstracts a user's answer to a question. It contains the actual question asked, the user's answer, and whether the 
user's answer was correct. It's json schema can be defined as:
{
  "question":{...},
  answer: 1,
  correct: true
}

"""
class Answer:
    answer=-1
    question=None
    correct=False    
    
    #constructor that initializes all the class properties accordingly
    def __init__(self,a,q):
        self.answer=a
        self.question=q
        self.correct=False

    #method that checks to see if the answer the user gives is correct, and stores 
    #value in the self.correct property
    def checkAnswer(self):
        if self.question is not None:
            if self.question.answer==self.answer:
                self.correct=True        


"""
The Test Object contains the program logic that controls the flow of the application. Users are prompted to answer questions.
They will be allowed to retake the test so long as they have not received a perfect score. Their current score is displayed 
at the completetion of the test, and any historical scores are also outputted for comparison
"""
class Test:
    #list that holds all the questions
    questions=[]
    #list that holds all the answers to the current round of test taking
    answers_list=[]
    #list that holds all the historical result scores
    scores=[]
    
    #Set used to track which questions have been already asked so that we don't repeat the same
    #question in the same round
    questions_already_asked=set()
    
    #constructor tha takes in the raw json and initializes all the class properties
    def __init__(self,q):
        the_questions=q["quiz"]
        self.questions_already_asked=set()
        for item,val in the_questions.iteritems():
            aQuestion=Question(item,val["question"],val["options"],val["answer"])
            self.questions.append(aQuestion)

   #Execute the test until the user has a perfect score or hits Ctrl+c
    def run_the_test(self):  
        print "**********Welcome to Lightspeed test taking module, please hit enter to continue**********"
        raw_input("")     
        score=0
        
        #Continue on if the score is not yet perfect
        while score<100.0: 
            self.answers_list=[] 
                 
            #run through all the questions
            self.take_the_test_once()
            #now we should get the score
            score=self.calculate_score()
            print "Your score for this round is: ", score, "%"
            
            if score==100.0:
                print "!!!!!!!!! Congrats, you received a perfect score !!!!!!!!!"
            
            #If there are previous scores, then output them for comparison
            if len(self.scores)>0:
                print "Here are your previous scores: "
                counter=1
                for aScore in self.scores:
                    print "Attempt ", counter, " score: ", aScore, "%"
                    counter+=1
            
            #Add the current score to the list of scores
            self.scores.append(score)
                
            if score<100.0:
                print "**********Hit Enter to take the test again or Ctrl+c to exit**********"
                raw_input("")
            
    #method that calculates the % of correctly answered questions for a given round
    def calculate_score(self):
        count=0
        total_score=0
        #iterate through the entire self.answers_list to count how many questions are correct
        for the_answer in self.answers_list:            
            if the_answer.correct:
                total_score+=1    
            count+=1
        score=0
        #Never divide by 0
        if(count!=0):
            #calculate the percentage of correct answers
            score=total_score/(count * 1.0)

        score=(score*100.0)        
        return score                

    #this method prompts the user to answer each of the questions, and randomizes which question is asked, but ensures
    #each question is asked only once
    def take_the_test_once(self):
        #empty out the set so we can keep track of which questions already have been asked
        self.questions_already_asked=set()
        #Get the total number of questions available to be asked
        times_to_ask=len(self.questions)
        count=1
        #make sure that we ask each question 
        while(count<=times_to_ask):
            #randomly generate a number that is a valid index to self.questions list
            index=random.randint(0,(times_to_ask-1))
            
            #if the number has already been used before we generate the number again
            #to ensure we do not repeat questions for a given test round
            while(index in self.questions_already_asked):
                index=random.randint(0,(times_to_ask-1))

            #Output the question and prompt the user for an answer
            print self.questions[index].question
            self.questions[index].print_options()
            answer=raw_input("Enter Answer: ")
            
            #instantiate an Answer Object so we can track an answer from the user
            anAnswer=Answer(answer,self.questions[index])
            anAnswer.checkAnswer()
            
            #If the user answers incorrectly output the correct answer and prompt the user to continue
            if not anAnswer.correct:
                print "########Your answer is incorrect, the correct answer is: ", anAnswer.question.answer
                print "**********Hit the enter key to continue**********"
                raw_input("")
            #add the answer to the answers_list so we can later calculate the score    
            self.answers_list.append(anAnswer)
            #ensure that we do not repeat the same question in a given round
            self.questions_already_asked.add(index)
            #increment the counter to notify that we have answered another question
            count+=1
       
       
#Instantiate a Test Object and execute the program       
myTest=Test(test)
myTest.run_the_test()
 


 
