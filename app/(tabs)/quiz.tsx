import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

type Question = {
    question: string;
    options: string[];
    answer: string;
};

export default function URQuiz() {
    const questions: Question[] = [
        {
            question: "What is the motto of the University of Rochester?",
            options: ["Carpe Diem", "Meliora", "Veritas", "Ad Astra"],
            answer: "Meliora",
        },
        {
            question: "What is the official flower of the University?",
            options: ["Rose", "Dandelion", "Tulip", "Lily"],
            answer: "Dandelion",
        },
        {
            question: "Who is the University mascot?",
            options: ["Ralph the Lion", "Rocky the Yellowjacket", "Eddie the Eagle", "Sammy the Squirrel"],
            answer: "Rocky the Yellowjacket",
        },
        {
            question: "When was the University of Rochester founded?",
            options: ["1850", "1800", "1901", "1865"],
            answer: "1850",
        },
        {
            question: "Which library preserves the class roll?",
            options: ["Rush Rhees Library", "River Campus Library", "Eastman Library", "Meliora Library"],
            answer: "Rush Rhees Library",
        },
        {
            question: "What weekend combines reunion, family, and homecoming events?",
            options: ["Winterfest Weekend", "Meliora Weekend", "Boar’s Head Weekend", "Convocation Weekend"],
            answer: "Meliora Weekend",
        },
        {
            question: "What is the name of the alma mater?",
            options: ["The Genesee", "Meliora Song", "UR Anthem", "River Song"],
            answer: "The Genesee",
        },
        {
            question: "What is the superstition associated with the Clock Tower?",
            options: [
                "You will fail your classes",
                "Something dreadful will happen if you walk under it",
                "You will get lost on campus",
                "You will drop your books"
            ],
            answer: "Something dreadful will happen if you walk under it",
        },
        {
            question: "Which famous founder is associated with Xerox?",
            options: ["George Eastman", "Joseph C. Wilson", "Azariah Boody", "Asahel Kendrick"],
            answer: "Joseph C. Wilson",
        },
        {
            question: "What is the first-night tradition for incoming students?",
            options: ["Winterfest", "Boar’s Head Dinner", "Candlelight Ceremony", "Meliora Parade"],
            answer: "Candlelight Ceremony",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showScore, setShowScore] = useState(false);

    const handleSelect = (option: string) => {
        setSelectedOption(option);
        if (option === questions[currentIndex].answer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        setSelectedOption(null);
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowScore(true);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {!showScore ? (
                    <View style={styles.quizContainer}>
                        <Text style={styles.dynamicScore}>
                            Score: {score} / {questions.length}
                        </Text>

                        <Text style={styles.question}>
                            {questions[currentIndex].question}
                        </Text>
                        {questions[currentIndex].options.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.optionButton,
                                    selectedOption === option && {
                                        backgroundColor: option === questions[currentIndex].answer ? '#4ade80' : '#f87171',
                                    },
                                ]}
                                onPress={() => handleSelect(option)}
                                disabled={!!selectedOption}
                            >
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                        {selectedOption && (
                            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                                <Text style={styles.nextButtonText}>
                                    {currentIndex + 1 === questions.length ? 'See Score' : 'Next Question'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>Your Score:</Text>
                        <Text style={styles.scoreNumber}>
                            {score} / {questions.length}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#001e5f' },
    scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    quizContainer: { width: '100%' },
    question: {
        fontSize: 24,
        fontFamily: 'pix',
        color: '#facc15',
        marginBottom: 20,
        textAlign: 'center',
    },
    optionButton: {
        backgroundColor: '#2563eb',
        padding: 14,
        marginVertical: 8,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#facc15',
    },
    optionText: { fontSize: 20, fontFamily: 'pix', color: 'white', textAlign: 'center' },
    nextButton: {
        backgroundColor: '#facc15',
        padding: 14,
        marginTop: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#2563eb',
    },
    dynamicScore: {
        fontSize: 20,
        fontFamily: 'pix',
        color: '#4ade80',
        textAlign: 'center',
        marginBottom: 15,
    },
    nextButtonText: { fontSize: 20, fontFamily: 'pix', color: '#1e3a8a', textAlign: 'center' },
    scoreContainer: { alignItems: 'center' },
    scoreText: { fontSize: 28, fontFamily: 'pix', color: '#facc15', marginBottom: 12 },
    scoreNumber: { fontSize: 40, fontFamily: 'pix', color: '#4ade80' },
});
