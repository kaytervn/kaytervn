package javatpoint.bridge;

// this is the Question interface.  
public interface Question {
	public void nextQuestion();

	public void previousQuestion();

	public void newQuestion(String q);

	public void deleteQuestion(String q);

	public void displayQuestion();

	public void displayAllQuestions();
}
// End of the Question interface.  