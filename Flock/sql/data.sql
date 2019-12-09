INSERT INTO users(fullname, email, pword, phone, picture, tagID)
VALUES ('Michael Cafarella', 'michjc@umich.edu', 'sha512$a45ffdcc71884853a2cba9e6bc55e812$c739cef1aec45c6e345c8463136dc1ae2fe19963106cf748baf87c7102937aa96928aa1db7fe1d8da6bd343428ff3167f4500c8a61095fb771957b4367868fb8', '2483124234', NULL, 1),
('H.V. Jagadish', 'jag@umich.edu', 'sha512$a45ffdcc71884853a2cba9e6bc55e812$c739cef1aec45c6e345c8463136dc1ae2fe19963106cf748baf87c7102937aa96928aa1db7fe1d8da6bd343428ff3167f4500c8a61095fb771957b4367868fb8', '2483124234', NULL, 2),
('Andrew DeOrio', 'adeorio@umich.edu', 'sha512$a45ffdcc71884853a2cba9e6bc55e812$c739cef1aec45c6e345c8463136dc1ae2fe19963106cf748baf87c7102937aa96928aa1db7fe1d8da6bd343428ff3167f4500c8a61095fb771957b4367868fb8', '2483124234', NULL, 3),
('Neil Khandwala', 'chessmaster333@gmail.com', 'sha512$a45ffdcc71884853a2cba9e6bc55e812$c739cef1aec45c6e345c8463136dc1ae2fe19963106cf748baf87c7102937aa96928aa1db7fe1d8da6bd343428ff3167f4500c8a61095fb771957b4367868fb8', '2483124234', NULL, 7);

INSERT INTO tags(tagID, outdoor_adventures, cooking, gaming, night_life, swimming, weight_lifting, photography, yoga, basketball, dancing)
VALUES (1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1),
(2, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1),
(3, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0),
(4, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0),
(5, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0),
(6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

INSERT INTO events(eventID, eventName, eventDescription, host, phone, picture, tagID)
VALUES (1, 'Hiking with Friends', 'Looking to go hiking in Ann Arbor', 'deorio', 2483124234, 'HikingWithFriends.jpeg', 4),
(2, 'Yoga with Friends', 'Looking to do Yoga in Ann Arbor', 'jag', 2483124234, 'JoggingWithJag.jpg', 5),
(3, 'Jogging with Jag', 'Looking to go jogging in Ann Arbor', 'jag', 2483124234, 'YogaWithFriends.jpg', 6);

INSERT INTO userEventInfo(userID, eventID, commitStatus)
VALUES (1, 1, 2),
(2, 1, 2),
(3, 2, 2),
(3, 1, 0),
(2, 2, 0),
(2, 3, 0);