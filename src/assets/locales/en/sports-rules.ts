export default {
    title: 'Sports Rules',
    expand: 'Expand',
    collapse: 'Collapse',
    sections: {
        generalRules: {
            title: 'General Rules',
            content: [
                {
                    title: '1. Introduction',
                    content:
                        '1.1. These betting rules govern the use of the sportsbook. Operators must ensure that, when placing a bet on the sportsbook, the end user accepts having read, understood and complied with these Betting Rules applicable to the sportsbook, at any time. The betting rules consist of the following sections:\n' +
                        '1.1.1. General rules;\n' +
                        '1.1.2. Sports-related rules;\n' +
                        '1.1.3. Esports-related rules;\n' +
                        '1.1.4. Virtual sports-related rules;\n' +
                        '1.1.5. Betby esports-related rules.\n' +
                        "1.2. The use of the sportsbook is at all times subject to the regulations imposed by the applicable law governing the operator's operations and the authority overseeing the operator's operations and/or the sportsbook.\n" +
                        '1.3. The sportsbook reserves the right to make changes to the site, betting limits, payout limits and offers without prior notice.\n' +
                        '1.5. These betting rules may be updated, modified, edited and supplemented at any time without prior notice.\n' +
                        '1.6. Any reference in these betting rules to words/objects appearing in the singular also applies to the plural. Gender references are not binding and should be treated for informational purposes only.\n' +
                        'The purpose of these Betting Rules is to process and redeem, if applicable, bets in a fair, honest manner and in accordance with these terms.',
                },
                {
                    title: '2. Definitions',
                    content:
                        '2.1. Sportsbook – means an online platform and everything connected to said platform (including but not limited to source code, object code, technologies, software and tools, executable applications, libraries, subroutines, widgets, plugins and other necessary material among others) for the provision of sportsbook services.\n' +
                        '2.2. End User - an individual who uses the sportsbook services through the website and who has accepted the betting rules.\n' +
                        "2.3. Bet – a risk-based contract entered into between the End User and the Operator on the outcome of an Event, market or set of the aforementioned, involving the placement of a Stake by the End User, resulting in a Win according to the Odds or a Loss of the Stake. The Operator's decision shall be subject to the sportsbook rules and these Betting Rules. Bets are placed on terms previously proposed by the sportsbook.\n" +
                        '2.4. Stake: the amount of money transferred by the End User to the Operator through the sports betting platform, the main condition for participating in a Bet in accordance with these Rules.\n' +
                        '2.5. The outcome - means the result of an event or a market on which the bet was placed by the end user through the sportsbook.\n' +
                        '2.6. Market – an in-play event on which an end user can place a bet through the sportsbook.\n' +
                        '2.7. Event – a sports, esports, virtual sports, political, entertainment or other event that takes place in real time and on which the operator is offering odds through the sportsbook.\n' +
                        '2.8. Odds — the coefficient determined by the sportsbook for the outcome of an event expressed as a numerical value.\n' +
                        '2.9. Winnings – the amount of money won by the end user as a result of a bet in the event that the end user correctly predicts the outcome of an event or market.\n' +
                        '2.10. Operator - a legal entity engaged in B2C (business to End User) betting activities in accordance with the licensing requirements and legislation of the country of operation and that provides betting services through its operated website.',
                },
                {
                    title: '3. General Rules',
                    content:
                        "3.1. No person who is underage or who does not meet the minimum age limit for betting in accordance with the applicable law of the end user's country is authorized to use the sportsbook services and, therefore, to open an end user account and place a bet.\n" +
                        '3.2. In the event of discrepancies between the English version of these betting rules and any other version in another language, the English version shall prevail.\n' +
                        '3.3. Once a bet has been accepted by the sportsbook, it cannot be reversed. The sportsbook shall not be liable for any missing or duplicate bets placed by an end user. The sportsbook platform will not review any requests to modify accepted bets and bets placed for the reason that a bet is missing or duplicated.\n' +
                        '3.4. All transactions of an end user may be reviewed in the "My Bets" user interface of the respective end user\'s sportsbook to ensure that all requested bets were accepted.\n' +
                        "3.5. Statistical data or editorial texts published on the sportsbook are for informational and entertainment purposes only, and not for decision-making. There are no guarantees regarding the correctness of such information or data. The sportsbook will not acknowledge or accept any liability for decisions made by an end user. At all times it is the end user's responsibility to be aware of the circumstances related to an event or market.\n" +
                        '3.6. The use of any automated system (any type of scanners, robots, etc.) on the sportsbook is prohibited. The sportsbook reserves the right to cancel any bets placed using automated systems of any kind.\n' +
                        '3.7. The use of multiple accounts or third-party accounts for the purpose of using the services offered on the sportsbook is prohibited. Bets placed in violation of the terms of this clause shall be void.\n' +
                        "3.8. The offering of events and markets available on the sportsbook may change from jurisdiction to jurisdiction, as the sportsbook's offering is at all times subject to applicable law.\n" +
                        '3.9. The sportsbook uses only reputable and legitimate data sources to determine the outcome of a bet. Unless data sources are expressly disclosed in these betting rules, the data source(s) may be disclosed to an end user upon request.\n' +
                        '3.10. In the event of any contradiction: market rules take priority over sport rules. Sport rules take priority over general rules. In the event that no specific market rules or sport rules exist, the general rules shall apply.\n' +
                        '3.11. An "X" included in a description of odds or a market in these terms shall be understood as a number defined in the sportsbook\'s offering.',
                },
                {
                    title: '4. Placing a bet/making a bet',
                    content:
                        '4.1. All bets placed by an end user and all bets accepted by the sportsbook are subject to these betting rules, as well as applicable law.\n' +
                        '4.2. For any bet to be valid, it must be expressly confirmed as accepted by the corresponding statement on the betting slip.\n' +
                        '4.3. At all times it shall remain at the sole discretion of the sportsbook whether or not to accept any bet.\n' +
                        '4.4. Bet types:\n' +
                        '4.4.1. Single (Ordinary) – a bet on a separate outcome of an event. The payout of a single bet shall be equal to the stake amount multiplied by the odds.\n' +
                        '4.4.2. Combo – a bet on several independent outcomes of events. To win such a bet, it is necessary that each outcome of each event included in this bet is correctly predicted. The incorrect prediction of any event included in the combo results in the loss of the combo in its entirety. The combo winnings are equal to the stake amount multiplied by the total combo odds.\n' +
                        '4.4.3. System - a set of combos, which is a complete search of combo variants of the same size from a fixed set of outcomes. It is characterized by the same stake amount for each option (system option) and the same number of outcomes in each option. Betting on a system must specify the total number of outcomes and the number of combos (system option). The system winnings are equal to the stake amount multiplied by the total system odds.\n' +
                        "4.4.4. A 'Trixie' is a combination bet, which includes a treble and three doubles from a selection of three events. For the avoidance of doubt in this clause and in these betting rules, a treble means a combo consisting of 3 (three) events/markets and a double means a combo consisting of 2 (two) events/markets. The Trixie winnings are equal to the stake amount multiplied by the total Trixie odds.\n" +
                        "4.4.5. A 'Patent' is a combination bet, which includes a treble, three doubles and three singles from a selection of three matches. The Patent winnings are equal to the stake amount multiplied by the total Patent odds.\n" +
                        "4.4.6. A 'Yankee' is a combination bet, which includes a fourfold, four trebles and six doubles from a selection of four matches. For the avoidance of doubt in this clause and in these betting rules, a fourfold means a combo consisting of 4 (four) events/markets. The Yankee winnings are equal to the stake amount multiplied by the total Yankee odds.\n" +
                        "4.4.7. A 'Canadian' (also known as 'Super Yankee') is a combination bet, which includes a fivefold, five fourfolds, ten trebles and ten doubles from a selection of five matches. For the avoidance of doubt in this clause and these betting rules, a fivefold means a combo consisting of 5 (five) events/markets. The Canadian winnings are equal to the stake amount multiplied by the total Canadian odds.\n" +
                        "4.4.8. A 'Heinz' is a combination bet, which includes a sixfold, six fivefolds, fifteen fourfolds, twenty trebles and fifteen doubles from a selection of six matches. For the avoidance of doubt in this clause and these betting rules, a sixfold means a combo consisting of 6 (six) events/markets. The Heinz winnings are equal to the stake amount multiplied by the total Heinz odds.\n" +
                        "4.4.9. A 'Super Heinz' is a combination bet, which includes a sevenfold, seven sixfolds, twenty-one fivefolds, thirty-five fourfolds, thirty-five trebles and twenty-one doubles from a selection of seven matches. For the avoidance of doubt in this clause and these betting rules, a sevenfold means a combo consisting of 7 (seven) events/markets. The Super Heinz winnings are equal to the stake amount multiplied by the total Super Heinz odds.\n" +
                        "4.4.10. A 'Goliath' is a combination bet, which includes an eightfold, eight sevenfolds, twenty-eight sixfolds, fifty-six fivefolds, seventy fourfolds, fifty-six trebles and twenty-eight doubles from a selection of eight matches. For the avoidance of doubt in this clause and these betting rules, an eightfold means a combo consisting of 8 (eight) events/markets. The Goliath winnings are equal to the stake amount multiplied by the total Goliath odds.\n" +
                        '4.4.11. If the odds have more than 2 digits after the decimal point, the payout will be rounded to the second digit after the decimal point.\n' +
                        '4.4.12. "Cash Out" is an individual offer initiated by the sportsbook, directed at an end user, intended to change one or more essential betting conditions (coefficient, event calculation time, etc.) to establish a new bet and end the previous bet at any current time (hereinafter - Cash Out). The offer to redeem a bet may be both accepted and rejected by the end user. By selecting "Cash Out", the end user confirms acceptance of the new essential bet conditions. Cash Out rates may be offered for both pre-match and live bets. The sportsbook reserves the right to change the offer to buy back the bet over time, or not to form an offer to buy back the bet without giving a reason.\n' +
                        '4.4.13. "Bet Builder" is a bet on multiple markets from the same event, such as total, 1x2, team statistics, player props and other markets marked with a Bet Builder tab. To win such a bet, it is necessary that each outcome of each market included in this bet is correctly predicted. The incorrect prediction of any market included in the Bet Builder bet results in the loss of the Bet Builder bet in its entirety. The Bet Builder bet winnings are equal to the stake amount multiplied by the total Bet Builder bet odds. Bet Builder may be available in different sports that are marked with a special Bet Builder tab on the event. Bet Builder bets may also be included in a Combo/System consisting of other Bet Builder bets or a combination of Bet Builder bets and non-Bet Builder bets. Special Bet Builder terms:\n' +
                        '• a) Bet Builder bets may not be available for all sports and/or events and/or markets. The availability of Bet Builder bets shall at all times remain at the sole and exclusive discretion of the sportsbook;\n' +
                        '• b) The availability of Bet Builder bets is not guaranteed and the sportsbook reserves the right to terminate the availability of Bet Builder bets for any reason at the sole discretion of the sportsbook (e.g. technical issues; sports betting integrity, etc.);\n' +
                        '• c) The sportsbook reserves the right to modify, suspend or remove the Bet Builder feature (or any part thereof) at any time;\n' +
                        '• d) The sportsbook reserves the right to reverse the outcome of a Bet Builder bet if the bet or a selection within the bet was settled in error (the terms of the betting rules related to errors apply).\n' +
                        '• f) The sportsbook reserves the right to accept or void any bet included in the Bet Builder bet in accordance with the terms of the betting rules on how to void bets. In the event that a bet included in the Bet Builder bet is void – the remaining (non-void) bets included in the Bet Builder remain. In the event of a void bet, the terms of the betting rules related to void bets apply.\n' +
                        '4.5. Market types:\n' +
                        '4.5.1. "Match" (1X2) allows betting on the result (partial or final) of a match or event. The options are: "1" = Home team, or the team listed on the left side of the offer; "X" = Draw, or the selection in the middle; "2" = Away team, or the team listed on the right side of the offer.\n' +
                        '4.5.2. "Correct Score" allows betting on the exact score (partial or final) of a match or event.\n' +
                        '4.5.3. "Over/Under" (Totals) allows betting on the quantity (partial or final) of a predefined occurrence (e.g., goals, points, corners, rebounds, penalty minutes, etc.). If the total quantity of the occurrences listed in the bet is exactly equal to the number of the respective occurrences listed in the betting line, then all bets on this offer shall be declared void. Example: an offer where the betting line is 128.0 points and the match ends with a score of 64-64 shall be declared void.\n' +
                        '4.5.4. "Odd/Even" allows betting on the odd or even quantity (partial or final) of a predefined occurrence (e.g., goals, points, corners, rebounds, penalty minutes, etc.) in an event. For the avoidance of doubt, an odd number shall be 1,3,5, etc., however, an even number shall be 0,2,4, etc.\n' +
                        '4.5.5. A "Head to Head" and/or "Triple-Head" allows betting on a competition between two or three participants/outcomes, originating from an officially organized event, or otherwise, as virtually defined by the sportsbook.\n' +
                        '4.5.6. "Half Time/Full Time" allows betting on the half-time result and the final result of the match. E.g. if at half time the score is 1-0 and the match ends 1-1, the winning result is 1/X. The bet shall be void if the regular time of the match is played in a time format different from those listed in the bet (i.e., anything other than two halves).\n' +
                        '4.5.7. "Period Bets" allow (where possible) betting on the result of each separate period within a match/event.\n' +
                        '4.5.8. "Draw No Bet" allows (where possible) betting on "1" or "2" as defined in 4.5.1. It is also common to refer to "Draw No Bet" in cases where draw odds are not offered. If the specific match has no winner (e.g. the match ends in a draw), or the particular occurrence does not happen (e.g. Draw No Bet and the match ends 0-0), the stake shall be refunded.\n' +
                        '4.5.9. "Handicap" allows (where possible) betting on the chosen result being victorious once the listed handicap is added to or subtracted from (as applicable) the match/period/total score to which the bet refers. In those circumstances where the result after the application of the handicap line is exactly equal to the betting line, then all such bets on this offer shall be void. Example: a -3.0 goals bet shall be declared void if the chosen team wins the match by exactly a 3-goal margin (3-0, 4-1, 5-2, etc.).\n' +
                        '4.5.10. "Asian Handicap": Home team (-1.75) vs Away team (+1.75). This means the bet is split into 2 equal bets and placed on the -1.5 and -2.0 outcomes. For the bet to pay in full at the listed odds, Team A must win the match by a margin greater than both of its listed handicaps (i.e., a 3-goal margin or more). In the event that Team A wins by only a 2-goal margin, the bet will be considered partially won with a full payout on the -1.5 part of the bet and a refund on the -2.0 side as the outcome on that part of the bet would be considered a "draw". If the match produces any other result, including a Team A victory by only a 1-goal margin, the entire bet would be lost. The away team receives a +1.75 goal advantage in the match. This means the bet is split into 2 equal bets and placed on the +1.5 and +2.0 outcomes.\n' +
                        '4.5.11. "Double Chance" allows (where possible) simultaneously betting on two (partial or final) outcomes of an event. The options are: 1X, 12 and X2 with "1", "X" and "2" as defined in 4.5.1.\n' +
                        '4.5.12. "Outright Bet" or "Placement" allows betting by choosing from a list of alternatives and placing a bet on the eventuality that a participant in an event wins or places within an event, at a position specified in the ranking of the listed event.\n' +
                        '4.5.13. Bets on "Quarter / Half / Period X" allow betting on the result/score achieved in the corresponding time interval and do not include any other points/goals/events counted from other parts of the event/match. Bets shall be void if the match is played in any format other than that stipulated in the offer or as stipulated in the scoreboard or as stipulated in the standard terms of the respective sport type as determined by the governing body of the respective sport (as applicable).\n' +
                        '4.5.14. Bets on "Result at the end of Quarter / Half / Period X" refer to the result of the match/event after the termination of the stipulated time interval and shall take into account all other points/goals/events counted from earlier parts of the event/match. Bets shall be void if the match is played in any format other than that stipulated in the offer or as stipulated in the scoreboard or as stipulated in the standard terms of the respective sport type as determined by the governing body of the respective sport (as applicable).\n' +
                        '4.5.15. Bets on "Race to X Points / Race to X Goals..." and similar offers refer to the team/participant that first reaches the particular count of points/goals/events. If the offer lists a time interval (or any other period restriction), it will not include any other points/goals/events counted from other parts of the event/match that are not related to the mentioned time interval. If the listed score is not reached within the stipulated time interval (if any), all respective bets shall be void, unless otherwise expressed in the offer.\n' +
                        '4.5.16. Bets on "Winner of Point X / Scorer of Goal X" and similar offers refer to the team/participant that scores/wins the listed occurrence. For the settlement of these offers, events that occur before the listed occurrence shall not be taken into consideration. If the listed event is not scored/won within the stipulated time interval (if any), all respective bets shall be void, unless otherwise expressed in the offer.\n' +
                        '4.5.17. Bets referring to the occurrence of a particular event in a predefined time order, such as "First Card", or "Next Team to Receive Penalty Minutes" shall be void if it is not possible, without any reasonable doubt, to decide the winning result, for example in the event that players from different teams are shown a card in the same stoppage of play.\n' +
                        '4.5.18. "Team to Score First and Win" refers to the listed team that scores the first goal in the match and wins the match. If there are no goals in the match, all bets shall be void.\n' +
                        '4.5.19. Any reference to "clean sheet" indicates that the listed team must not concede any goals during the match.\n' +
                        '4.5.20. "Team to Win from Behind" refers to the listed team that wins the match after having been at least 1 goal behind at any point during the match.\n' +
                        '4.5.21. Any reference to a team winning all halves/periods (e.g. Team to Win Both Halves) means that the listed team must score more goals than its opponent during all stipulated halves/periods of the match.\n' +
                        '4.5.22. Any reference to "Injury Time" refers to the amount shown by the designated official and not the actual amount played.\n' +
                        '4.5.23. Settlement of bets on offers such as "Man of the Match", "Most Valuable Player" etc. shall be based on the event organizer\'s decision, unless otherwise expressed in the offer.\n' +
                        '5.13. If a market includes exact names of one of two competitors, then all listed competitors must participate in the event for the bet to be valid.\n' +
                        '5. Events and Outcomes\n' +
                        '5.1. The dates and times of events published on the sportsbook are purely informational in nature. Neither the sportsbook nor the operator guarantees the accuracy of such information. An incorrectly published time and/or date of an event is not a reason for voiding bets unless otherwise expressed in these betting rules.\n' +
                        '5.2. The sportsbook platform may display live scores for informational purposes; however, the accuracy of such information is not guaranteed and cannot be used for the purpose of bet settlement.\n' +
                        '5.3. Bets on an event (including all markets within said event) shall be settled once the respective event has been completed and the official result has been announced.\n' +
                        "5.4. The outcome of an event shall be determined on the date of the event's conclusion, unless the official result is provided later. The outcome of an event shall be the final determination by the governing body of the event on the date of the event's completion, except where otherwise expressed in these betting rules. In the event that any event is provided outside of official competitions, bets shall be settled using the information provided by the event organizer.\n" +
                        '5.5. If an Event has started and has not ended within 48 (forty-eight) hours of its official start time, all bets on said Event shall be void, with the exception of:\n' +
                        '• bets placed on odds related to periods that have been played to completion;\n' +
                        '• events that in their normal course may take more than 30 hours (e.g. golf tournaments);\n' +
                        '• sport-specific exceptions determined by this section of the betting rules for each individual sport.\n' +
                        '• bets on "First Team to Score", which shall have action as soon as there is a score, regardless of whether the event has been completed or not.\n' +
                        '5.6. If an event did not start within 12 (twelve) hours of its scheduled start time, all bets on that event shall be void.\n' +
                        '5.7. The settlement and/or resolution of a suspended event after the event has started shall be carried out in accordance with the rules specified for that particular sport type below. If nothing applies in the sport rules, clause 5.5. of the General Rules shall apply.\n' +
                        '5.8. For the purposes of bet settlement, protested or reversed decisions that change the final result of any event/market shall not be recognized.\n' +
                        '5.9. Bets are placed on the outcome of an event/market, regardless of the score at the time the bet was placed, for example, any incorrect score displayed other than football goals and red cards are not grounds for voiding bets.\n' +
                        '5.10. Bets on a specific period count only the score in that period, and are not affected by what happens in any earlier or later period.\n' +
                        '5.11. If a "Draw" odds market is offered alongside the Winner markets for an event, and a draw occurs, bets on the Winner markets for each team lose. If a draw is not offered and a draw occurs, then bets on the Winner markets for both teams are void, unless otherwise expressed in the sport-specific rules.\n' +
                        '5.12. In any event involving a walkover, a forfeit victory or any other situation in which the event is considered finished without having been played, all bets shall be void, regardless of the score from the governing body of its league or sport.\n' +
                        '5.13. Misspellings, typographical errors, team name changes and incorrect leagues shall not be grounds for voiding a bet, provided that, reasonably and based on context, it is clear what the intended event was.\n' +
                        '5.14. If an event takes place with an incorrect number of sections of an event (e.g. periods, sets, etc.) or with a non-standard duration of the respective event without being indicated, all bets on such event shall be void.\n' +
                        '5.15. For the "Home/Away Aggregate Score of a league on a day (or week in the case of American football)" market, if all events of that day/week in that league are not played to completion, all bets on the market are void.\n' +
                        '5.16. For the "Multi-Way Bets" market, bets will always have action unless a stipulation is added to the respective market that a particular competitor must start for the bet to have action. If a stipulation is included, then all bets on all competitors shall be void if the stipulated competitor does not start in that specific event.\n' +
                        '5.17. All winning bets on "Multi-Way" markets are paid at full odds, regardless of the number of winners.\n' +
                        '5.18. If a market is offered with "The Field" as a betting option, the designated teams or competitors must beat all other competitors for the bet on that competitor to win. If a listed competitor ties, bets on the tied competitors shall be void and all other bets shall be lost.\n' +
                        '5.19. All settled markets are final after 72 hours and no inquiries shall be accepted after that time period. Within 72 hours of the settlement of markets, the sportsbook will only reinstate or correct results due to human error, system errors or errors made by the results source.\n' +
                        '5.20. Outright winner bets are considered total and will be considered losers if the selection does not participate in the event, unless otherwise indicated. Dead heat rules apply where there is more than one winner. Bets are first divided by the number of selections that tied and then this portion of the bets is settled as a win and the remainder is settled as a loss.\n' +
                        '5.21. If one of the competitors in an event does not start, the sportsbook will cancel this head-to-head market.\n' +
                        '5.22. In racing sports, unless otherwise provided in the respective sport rules, if both competitors in an event did not finish, the winner of the event shall be the competitor who has the most laps. If both competitors are out on the same lap, the sportsbook will cancel this head-to-head market.\n' +
                        '5.23. If the competitors are in the same position, the sportsbook will void bets on this head-to-head market.\n' +
                        '6. Acceptance, Suspension and Voiding of Bets\n' +
                        "6.1. All bets shall be accepted or rejected at the 'sole discretion of the sportsbook' and subject to its risk management policies (as applicable at any given time).\n" +
                        '6.2. The acceptance of live bets (during the match) may suffer a brief delay or remain pending during dangerous situations (e.g., free kick, 1:1 attack, etc.), at the discretion of the sportsbook.\n' +
                        '6.3. The sportsbook platform reserves the right to reject, restrict, cancel or limit any bet.\n' +
                        '6.4. The sportsbook platform reserves the right to declare bets (or parts thereof) void (payouts are made at odds of "1") or to suspend payouts until the end of the trial (including judicial) in one of the following cases:\n' +
                        '6.4.1. Errors are made in accepting bets;\n' +
                        '6.4.2. There is a software/website error (obvious typing errors in the list of events offered, odds discrepancy across multiple positions, unusual or incorrect odds, etc.);\n' +
                        '6.4.3. If there are traces of unfair practices used (bets placed fraudulently, obvious "bad" odds (e.g., clearly incorrect odds), swapped odds);\n' +
                        '6.4.4. There is a deviation from the current rules during the acceptance of a bet;\n' +
                        '6.4.5. There are other circumstances confirming the incorrect bet;\n' +
                        '6.4.6. The bet was placed after an event had started or the event had already occurred;\n' +
                        '6.4.7. The venue of the event was changed, unless otherwise indicated in the rules of the particular sport;\n' +
                        '6.4.8. The outcome of the Event or Market at the time the Bet was placed was already known or if the odds were not correctly updated due to technical issues.\n' +
                        '6.4.9. When the outcome has been altered by the imposition of sanctions or when the imposition of sanctions affects the outcome (e.g., penalty points, forced relegations or any other measure imposed as a result of any circumstances other than the normal results of the matches or competitions in question).\n' +
                        '6.5. If there is an obvious error in the odds or in the market limit, bets placed at odds with an obvious error or exceeding the market limit may be voided. If for any reason a bet is accepted after the start of an Event (except for clearly indicated live bets), bets shall be valid unless the End User has gained a significant advantage. The sportsbook reserves the right to void the bet if it is determined that an unfair advantage has been gained.\n' +
                        '6.5. In the event of suspected unfair activity, the sportsbook reserves the right to void any bet (in these cases, payout is made at odds of "1") or to suspend any withdrawal for up to 31 calendar days.\n' +
                        '6.6. For End User accounts with a negative balance, the Sportsbook reserves the right to void any pending Bet, regardless of whether it was placed with funds resulting from the error or not.\n' +
                        '6.7. The sportsbook reserves the right to suspend the acceptance of bets from any unique end user ID without prior notice.\n' +
                        '6.8. The sportsbook shall not be liable for any damages suffered by the end user as a result of system malfunction, defects, delays, manipulation or data transfer errors.\n' +
                        "6.9. The abuse of gaming software errors or translation errors is prohibited. An end user / operator who discovers any error in the gaming software must report it immediately. If an End User/Operator abuses errors in the gaming software, the sportsbook reserves the right to suspend the End User's betting account, freeze funds and cancel bets placed or already placed.\n" +
                        '6.10. In Combo (also called accumulators, parlays, multis) if certain outcomes are related, for example: betting on Barcelona to win the League combined with a Barcelona victory in the decisive game, these bets shall be void.\n' +
                        '7. Betting Integrity\n' +
                        '7.1. The maximum cumulative winnings for multiple bets in a calendar day is _______.\n' +
                        '7.2. The sportsbook may limit the maximum amount of a bet at its discretion for any event, market, operator or end user individually. Maximum bet/stake limits may change without prior notice. Changes shall not apply to bets that have already been accepted.\n' +
                        '7.3. End users are permitted to bet only as individuals. Group bets are not allowed. Repeated bets on the same outcome placed by the same End User or by a different one may subsequently be declared void at the sole discretion of the sportsbook.\n' +
                        '7.4. Even after the official result of the event is known, the sportsbook may consider the indicated bets invalid if it considers that the End User(s) is/are acting in collusion or as a syndicate, or that the bets in question were placed by one or more End User(s) within a short period of time.\n' +
                        '7.5. The sportsbook has the right to reject bets or to consider bets already placed void if they are placed from different gaming accounts from the same IP address.\n' +
                        '7.6. The sportsbook may declare an event or market unavailable for betting in the event of suspected integrity, fairness, gaming or system failure, until the problem is resolved. This includes, but is not limited to, the possibility of, depending on the circumstances – suspending bets on any event or market; withholding settlement and rejecting any bet until the failure has been resolved, making decisions at all times in a fair, reasonable and good faith manner.\n' +
                        '7.7. In any case where there is a gaming or system failure, including where sports and event betting transactions are not recoverable, bets placed shall be void and stakes returned to end users.\n' +
                        '7.8. In the event of impossibility of obtaining official event data related to time, the sportsbook shall void bets affected by the delay.\n' +
                        '7.9. In the event of impossibility of obtaining official event data related to time, the sportsbook shall void bets affected by the delay.\n' +
                        '7.10. The use of arbitrage strategies, which involve taking advantage of odds differences between different sportsbooks to guarantee profits, is strictly prohibited on our sportsbook. We do not endorse any form of betting activity that seeks to manipulate odds or exploit discrepancies to guarantee profits. End users caught engaging in arbitrage betting will face immediate cancellation of bets. Our sportsbook is designed to offer fair and competitive betting opportunities to all end users, and any attempt to circumvent this principle undermines the integrity of our sportsbook. By using our services, end users agree to refrain from employing arbitrage strategies and understand that violation may result in permanent restrictions. Any disputes related to suspected arbitrage activities shall be resolved at the discretion of the sportsbook, and decisions shall be final.\n' +
                        '8. Bonuses\n' +
                        '8.1. Any bet placed with a system bet shall not count toward the bonus wagering requirement.\n' +
                        '8.2. Combo Boost\n' +
                        '8.2.1.\n' +
                        '8.2.2. The calculation of the final bonus amount is based on the final odds of the Combo once all outcomes have been settled.\n' +
                        '8.2.3. Cashed out bets are not eligible for a Combo Boost.\n' +
                        '8.2.4. The sportsbook reserves the right to modify, cancel, reclaim or reject any promotion at its sole discretion.\n' +
                        '8.2.5. Combo Boost is only available on selections with odds of 1.50 or higher.\n' +
                        '8.3. Free bets, free money, risk-free bet.\n' +
                        '8.3.1. Free bet - the end user only receives the winning portion of the bet. For example, a free bet of 5 with odds of 3.5, the player receives in their account 5*3.5 - 5 = 12.5\n' +
                        '8.3.2. Free money - the end user receives the stake and the winning portion in the account. For example, free money of 5 with odds of 3.5, the player receives in their account 5*3.5 = 17.50\n' +
                        '8.3.3. Risk-free bet - a regular bet, but if the end user loses, they receive their stake refunded.',
                },
            ],
        },
        specialRulesForSports: {
            title: 'Special Rules for Sports',
            content:
                '1. Football\n' +
                '1.1. Bets on the result of a match shall be decided based on two halves of the scheduled number of minutes each and any time the referee adds to compensate for injuries and other stoppages. It does not include extra time periods or penalty shootouts unless otherwise indicated.\n' +
                '1.2. Corners awarded but not taken shall not be considered.\n' +
                '1.3. Own goals shall not count for "Anytime Goalscorer", "Player to Score X" or "Next Goalscorer" or other markets or odds, and shall be disregarded.\n' +
                '1.4. All players who took part in the match from the start or since the previous goal are considered as participants.\n' +
                '1.5. For "Player Prop" markets - if a player is not in the starting XI, all respective player markets shall be voided.\n' +
                "1.6. Anytime Goalscorer Markets: bets shall stand if a player entered the match as a substitute. Non-playing players and those who were on the squad list but remained on the substitutes' bench and did not play in the match shall be voided.\n" +
                '1.7. First Goalscorer Markets: bets shall stand if a player entered the match as a substitute before the first goal was scored. Non-starting players and players who were included in the squad but remained on the bench and did not play in the match shall be voided.\n' +
                "1.8. Last Goalscorer Markets: bets shall stand if a player entered the match as a substitute. Non-playing players and those who were on the squad list but remained on the substitutes' bench and did not play in the match shall be voided. If a player left the match before the last goal was scored, bets shall be voided.\n" +
                'For the purposes of this clause, a non-starting player shall be understood as a player who was not included in the matchday squad.\n' +
                '1.9. If for any reason an unlisted player scores a goal, all bets on the listed players shall remain valid. For the purposes of this clause and these terms in general, an unlisted player shall be understood as a player who was not included in the matchday squad.\n' +
                '1.10. "Anytime Goalscorer" or "Player to Score X" or "Next Goalscorer" markets shall be settled according to the TV broadcast and statistics provided by Press Association, unless there is clear evidence that these statistics are not correct.\n' +
                '1.11. Interval markets shall be settled according to the goal time announced by the TV broadcast. If this is not available, the time according to the match clock shall be considered.\n' +
                '1.12. Goal interval markets are settled according to when the ball crosses the line, and not the time the shot is taken.\n' +
                '1.13. Corner interval markets are settled according to the time the corner kick is taken and not the time the corner is awarded or granted.\n' +
                '1.14. Booking interval markets are settled according to the time the card is shown and not the time the foul is committed.\n' +
                '1.15. Offsides shall be settled according to the time the referee gives the decision. This rule shall apply in any video assistant (VAR) situation.\n' +
                '1.16. Penalty markets shall be settled according to the time the referee gives the decision. This rule shall apply in any video assistant (VAR) situation.\n' +
                '1.17. Penalties awarded but not taken shall not be considered.\n' +
                '1.18. Next scoring type:\n' +
                '1.18.1. Free kick: The goal must be scored directly from the free kick or corner to qualify as a free kick goal. Deflected shots count as long as the free kick or corner taker is credited with the goal.\n' +
                '1.18.2. Penalty: The goal must be scored directly from the penalty. Goals scored after a rebound from a missed penalty do not count.\n' +
                '1.18.3. Own goal: If a goal is declared as an own goal.\n' +
                "1.18.4. Header: The scorer's last touch must be with the head.\n" +
                '1.18.5. Shot: The goal must be scored with some other part of the body other than the head and the other types do not apply.\n' +
                '1.18.6. No goal: If no goal has been scored.\n' +
                '1.19. If the market was opened with a missing or incorrect red card, the sportsbook reserves the right to void bets on the respective market, if such bets are affected by the missing or incorrect red card.\n' +
                '1.20. If odds were offered with an incorrect match time (more than 5 minutes), we reserve the right to void the respective bets.\n' +
                '1.21. If an incorrect result is entered on the sportsbook scoreboard, all markets shall be void for the time during which said result was displayed.\n' +
                '1.22. If team names or the tournament are displayed incorrectly, we reserve the right to void the respective bets.\n' +
                '1.23. A yellow card counts as 1 card and a red card or yellow-red card counts as 2. The 2nd yellow for a player leading to a yellow-red card is not considered. As a consequence, a player cannot cause more than 3 cards.\n' +
                '1.24. Settlement shall be made in accordance with all available evidence of cards shown during the regular 90 minutes of play.\n' +
                '1.25. Cards shown after regular time shall not be considered.\n' +
                '1.26. Cards for non-players (already substituted players, coaches, players on the bench, team managers) shall not be considered.\n' +
                '1.27. A yellow card counts as 10 points and a red card or yellow-red card counts as 25 points. The 2nd yellow card for a player leading to a yellow-red card is not considered. As a consequence, a player cannot cause more than 35 booking points.\n' +
                '1.28. Settlement shall be made in accordance with all available evidence for cards shown during the regular 90 minutes of play.\n' +
                '1.29. If the match format is modified, the sportsbook reserves the right to void all bets.\n' +
                '1.30. If a friendly match ends by referee decision before 80 minutes, bets shall be voided.\n' +
                '1.31. Team statistics markets (such as Shots, Shots on Target, Offsides, Throw-ins, Fouls, Saves, Goal Kicks, Specials) shall be settled according to the information received from the data provider, as applicable. In the event that this information is omitted from the direct query or there is an obvious error in the information included in the aforementioned sources, the bet settlement shall be based on the following public sources (in no order of priority):\n' +
                '1.32. All football player bets are settled using information provided by OPTA (https://soccerstats.info/)\n' +
                'www.sportinglife.com\n' +
                'www.espn.com\n' +
                'www.xscores.com\n' +
                'www.flashscore.com\n' +
                'www.365scores.com\n' +
                'www.matchstat.com\n' +
                'www.rte.ie\n' +
                'www.whoscored.com\n' +
                '1.33. Woodwork (post or crossbar) — in the event that the ball hits the goalpost or crossbar and then remains in play (touched by a player or referee, off the other post or crossbar, etc.). If the ball hits the goalpost/crossbar and then bounces off another post/crossbar, only one woodwork hit is counted, provided that after the first hit the ball was not touched by any player or referee.\n' +
                '1.34. Offside. If there is a free kick after an offside is called - the offside counts.\n' +
                '1.35. The use of the Video Assistant Referee (VAR) ("Video Review") during matches is confirmed by TV broadcasts after the following events: the head referee signals for a video review (a square drawn in the air), the head referee checks the incident on the video review screen on the field.\n' +
                'Important Note. The "Goal Review" message on the scoreboard, or the referee putting his hand to his ear, are not indications of an official video review. All other conversations between referees and their associates are also not considered official video reviews. More about the official video review system (VAR) https://www.fifa.com/technical/football-technology.\n' +
                '1.36. Bet on the medical team entering the field. The medical team is only considered to have entered the field when the referee grants permission and the player receives assistance. In the event that two medical teams are called to enter the field at the same time for different football teams by the head referee, such entries are counted as a single medical team entry.\n' +
                '1.37. Understanding of terms used for Football Player Bets:\n' +
                '1.37.1. Goal/Own Goal\n' +
                'Different governing bodies have different rules, and where possible OPTA https://soccerstats.info/ works with the relevant people to reflect their official decisions on goalscorers.\n' +
                'Regarding deflections, a goal is normally awarded if the original attempt is heading towards goal. An own goal is normally awarded if the attempt is deflected towards goal by an opponent.\n' +
                '1.37.2. Shots\n' +
                'A shot on goal is defined as any clear attempt to score that:\n' +
                'Goes towards the net regardless of intent.\n' +
                'Is a clear attempt to score that would have gone in but for being saved by the goalkeeper or stopped by a player who is the last man and the goalkeeper has no chance of preventing the goal (last-line block).\n' +
                'Goes over or wide of the goal without making contact with another player.\n' +
                "Would have gone over or wide of the goal if not stopped by the goalkeeper's save or by an outfield player.\n" +
                'Hits the frame of the goal directly and a goal is not scored.\n' +
                'Blocked shots are not counted as shots.\n' +
                '1.37.3. Shots on target - any attempt at goal that:\n' +
                'Goes towards the net regardless of intent.\n' +
                'Is a clear attempt to score that would have gone in but for being saved by the goalkeeper or stopped by a player who is the last man and the goalkeeper has no chance of preventing the goal (last-line block).\n' +
                'Shots that hit the frame of the goal directly are not counted as shots on target, unless the ball goes in and is credited as a goal.\n' +
                'Shots blocked by another player, who is not the last man, are not counted as shots on target.\n' +
                '1.37.4. Goal assist\n' +
                'The last touch (pass, pass-shot or any other touch) that leads to the recipient of the ball scoring a goal. If the last touch (as defined in this clause) is deflected by a player of the opposing team, the initiator is only awarded a goal assist if the receiving player would likely have received the ball without the deflection occurring. Own goals, directly taken free kicks, direct corner goals and penalties do not receive an assist.\n' +
                '1.37.5. Tackle\n' +
                'A tackle is defined as where a player connects with the ball in a ground challenge where they successfully take the ball from the player in possession.\n' +
                'The tackled player must be clearly in possession of the ball before the tackle is made.\n' +
                'A tackle won is considered one where the tackler or one of their teammates regains possession as a result of the challenge, or where the ball goes out of play and is "safe";\n' +
                'A tackle lost is one where a tackle is made but the ball goes to an opposing player.\n' +
                'Both are considered successful tackles, however, the outcome of the tackle (won or lost) is different depending on where the ball goes after the tackle.\n' +
                'It is not a tackle when a player intercepts a pass by any means.\n\n' +
                'Tennis\n' +
                '2.1. In the event of a player retiring and a walkover occurring, all undecided bets shall be voided.\n' +
                '2.2. In the event of any delay (rain, darkness...) all markets remain undetermined and trading shall continue as soon as the match resumes.\n' +
                '2.3. If penalty points are awarded by the umpire, all bets on that game shall remain valid.\n' +
                '2.4. In the event that a match ends before certain points/games have been completed, all markets related to the affected points/games shall be considered void.\n' +
                '2.5. If markets remain open with an incorrect score that has a significant impact on the odds, the extent of the impact being reasonably determined, the sportsbook reserves the right to void the respective bets.\n' +
                '2.6. If players/teams are displayed incorrectly, the sportsbook reserves the right to void the respective bets.\n' +
                '2.7. If a player retires, all undecided markets are considered void.\n' +
                '2.8. If a match is decided by a match tiebreak, the tiebreak shall be considered to be the 3rd set.\n' +
                '2.9. Each tiebreak or match tiebreak counts as 1 game.\n\n' +
                'Basketball\n' +
                '3.1. Markets do not consider overtime unless expressly stated otherwise.\n' +
                '3.2. If odds were offered with an incorrect match time (more than 2 minutes), the sportsbook reserves the right to void the respective bets.\n' +
                '3.3. If markets remain open with an incorrect score on the sportsbook scoreboard, which has a significant impact on the odds, the extent of the impact shall be reasonably determined by the sportsbook, which reserves the right to void the respective bets.\n' +
                '3.4. In the event that a match does not end in a draw, but overtime is played for classification purposes, markets shall be settled in accordance with the result at the end of regular time.\n' +
                '3.5. If a match ends before the X is reached. (e.g., for the markets "Who scores the Xth point? (incl. OT)", "Which team will win the race to x points? (incl. OT)"), the respective bets shall be voided.\n' +
                '3.6. The "Will there be overtime?" market shall be settled as "yes" if at the end of regular time the match ends in a draw, regardless of whether overtime is actually played or not.\n' +
                '3.7. Basketball Player Rules:\n' +
                '3.7.1. If one or more of the players in any bet does not participate, the bet shall be voided.\n' +
                '3.7.2. All player bets shall be settled as soon as the official final score is received from statistics providers.\n' +
                '3.7.3. If the venue of the scheduled match is changed, all bets on the match shall remain in effect, provided that the game is not postponed by more than 48 hours, and provided that the home team continues to be designated as such. If the game is cancelled or postponed and does not resume on the same day, all pending bets that have not already been settled based on an outcome being determined during the game shall be voided.\n' +
                '3.7.4. If a game that has started is suspended, due to a rain delay or other postponement, and resumes within 36 hours of the originally scheduled time (local time), then all bets shall remain in effect. If a game starts, is then suspended, and resumes more than 36 hours after the originally scheduled time (local time), all existing bets shall be voided unless they were determined prior to the suspension of the game.\n' +
                '3.7.5. All overtime periods are included in settlement.\n' +
                '3.7.6. The sports data sources for the NBA and NCAA are nba.com and ncaa.com.\n' +
                '3.7.7. The sports data source for Euroleague basketball is the data provider – feed.\n\n' +
                'American Football\n' +
                '4.1. In the event of any delay (rain, darkness...) all markets shall remain unsettled and trading shall continue as soon as the match resumes.\n' +
                '4.2. Markets do not consider overtime unless expressly stated otherwise.\n' +
                '4.3. If markets remain open with an incorrect score, which has a significant impact on the odds, the extent of the impact shall be determined by the sportsbook acting reasonably, the sportsbook reserves the right to void the respective bets.\n' +
                '4.4. If odds were offered with an incorrect match time (more than 89 seconds), the sportsbook reserves the right to void the respective bets.\n' +
                '4.5. If an incorrect score is displayed, the sportsbook reserves the right to void bets for that time interval.\n' +
                '4.6. In the event of abandoned or postponed matches, all markets are considered void unless the match continues within the same NFL weekly schedule (Thursday - Wednesday, local stadium time).\n' +
                '4.7. If teams are displayed incorrectly, the sportsbook reserves the right to void the respective bets.\n' +
                '4.8. All players offered are considered as participants.\n' +
                '4.9. If no other touchdown is scored, the "Next touchdown scorer (incl. OT)" market shall be voided.\n' +
                '4.10. Players who are not listed for the matchday squad are considered as "Competitor1 other player" or "Competitor2 other player" for settlement purposes. Important Note. This does not include players who are listed without an active odd.\n' +
                '4.11. Defense or special teams players are considered as "Competitor1 d/st player" or "Competitor2 d/st player" for settlement purposes, even if the player is listed as a dedicated outcome.\n' +
                '4.12. The market shall be settled based on the TV broadcast and statistics provided by the official associations unless there is clear evidence that the statistics are not correct.\n' +
                '4.13. American Football Player Rules:\n' +
                '4.13.1. If one or more of the players in any bet does not participate, the bet shall be voided.\n' +
                '4.13.2. All player bets shall be settled as soon as the official final score is received from statistics providers.\n' +
                '4.13.3. If the venue of the scheduled match is changed, all bets on the match shall remain in effect, provided that the game is not postponed by more than 48 hours, and provided that the home team continues to be designated as such. If the game is cancelled or postponed and does not resume on the same day, all pending bets that have not already been settled based on an outcome being determined during the game shall be voided.\n' +
                '4.13.4. If a game that has started is suspended, due to a rain delay or other postponement, and resumes within 36 hours of the originally scheduled time (local time), then all bets shall remain in effect. If a game starts, is then suspended, and resumes more than 36 hours after the originally scheduled time (local time), all existing bets shall be voided unless they were determined prior to the suspension of the game.\n' +
                '4.13.5.The sports data source for American football is nfl.com.\n' +
                '4.13.6.A touchdown is credited to any player who carries or receives the ball into the end zone (i.e., excludes passing TDs)\n' +
                '4.13.7. "Player tackles" markets are settled based on total tackles, which is the sum of solo tackles + assisted tackles.\n' +
                'All overtime periods are included in settlement.\n\n' +
                'Ice Hockey\n' +
                '5.1. All markets (except period, overtime and penalty shootout markets) are considered for regular time only unless expressly stated otherwise in the respective market.\n' +
                "5.2. In the event that a game is decided by a penalty shootout, one goal shall be added to the winning team's score and the game total for settlement purposes. This applies to all markets, including overtime and penalty shootout markets.\n" +
                '5.3. If the market remains open when the following events have already occurred: goals and penalties, the sportsbook reserves the right to void the respective bets.\n' +
                '5.4. If odds were offered with an incorrect match time (more than 2 minutes), the sportsbook reserves the right to void the respective bets.\n' +
                '5.5. If an incorrect score is entered on the sportsbook scoreboard, all markets shall be cancelled for the time during which said score was displayed.\n' +
                '5.6. Ice Hockey Player Rules:\n' +
                '5.6.1. If one or more of the players in any bet does not participate, the bet shall be voided.\n' +
                '5.6.2. All player bets shall be settled as soon as the official final score is received from statistical data providers.\n' +
                '5.6.3. If the venue of the scheduled match is changed, all bets on the match shall remain in effect, provided that the game is not postponed by more than 48 hours, and provided that the home team continues to be designated as such. If the game is cancelled or postponed and does not resume on the same day, all pending bets that have not already been settled based on an outcome being determined during the game shall be voided.\n' +
                '5.6.4. If a game that has started is suspended, due to a rain delay or other postponement, and resumes within 36 hours of the originally scheduled time (local time), then all bets shall remain in effect. If a game starts, is then suspended, and resumes more than 36 hours after the originally scheduled time (local time), all existing bets shall be voided unless they were determined prior to the suspension of the game.\n' +
                '5.6.5.The sports data source for the NHL is nhl.com.\n' +
                'All overtime periods are included in settlement, but do not include penalty shootouts.\n\n' +
                'Baseball\n' +
                '6.1. If an inning ends before the Xth point is reached (incl. extra innings), bets placed on this market (Which team wins the race to x points?, Who scores the Xth point (incl. OT)?) shall be voided.\n' +
                '6.2. The "When will the match be decided?" market shall be settled as "Any extra inning" if at the end of regular time (after a full 9 innings) the match ends in a draw, regardless of whether or not overtime (extra innings) is actually played.\n' +
                '6.3. The "Will there be overtime?" market shall be settled as "Yes" if at the end of regular time (after 9 full innings) the match ends in a draw, regardless of whether or not overtime (extra innings) is actually played.\n' +
                '6.4. Possible extra innings are not considered in any market unless expressly stated otherwise.\n' +
                '6.5. All markets shall be settled according to the final result after 9 innings (8 1⁄2 innings if the home team is leading at that point). The only exception is the pre-match Winner market (rule no. 6.9.).\n' +
                '6.6. In the event of a postponed match, all markets are considered void unless the match continues within 48 hours of the official start time.\n' +
                '6.7. If markets remain open with an incorrect score or incorrect match status, which has a significant impact on the odds, the extent of the impact shall be determined by the sportsbook acting reasonably, the sportsbook reserves the right to void the respective bets.\n' +
                '6.8.Baseball Player Rules:\n' +
                '6.8.1. If one or more of the players in any bet does not participate, the bet shall be voided.\n' +
                '6.8.2. All player bets shall be settled as soon as the official final score is received from statistical data providers.\n' +
                '6.8.3.If the venue of the scheduled match is changed, all bets on the match shall remain in effect, provided that the game is not postponed by more than 48 hours, and provided that the home team continues to be designated as such. If the game is cancelled or postponed and does not resume on the same day, all pending bets that have not already been settled based on an outcome being determined during the game shall be voided.\n' +
                '6.8.4.If a game that has started is suspended, due to a rain delay or other postponement, and resumes within 36 hours of the originally scheduled time (local time), then all bets shall remain in effect. If a game starts, is then suspended, and resumes more than 36 hours after the originally scheduled time (local time), all existing bets shall be voided unless they were determined prior to the suspension of the game.\n' +
                '6.8.5.All extra innings are included in settlement.\n' +
                '6.8.6.If a player was not in the starting lineup for Baseball, the bet shall be voided.\n' +
                '6.8.7.Player Bets. If a definitive outcome for a player bet can be determined during the game, it shall be settled as win/lose regardless of how many innings are played. For all other player markets that have an indeterminate outcome, the game must last at least 8.5 innings for bets to stand; otherwise, these bets shall be voided.\n' +
                '6.8.8.If there is a late pitcher change, then all bets shall stand regardless of who the starting pitcher is. However, if an individual pitcher does not start the game, then all markets for that player shall be voided.\n' +
                '6.9. In the event of an abandoned match, all undecided markets are considered void unless the match continues within 48 hours of the official start time. All fully decided markets shall be settled.\n' +
                '6.10. The Winner market shall be settled for pre-match if the match lasts at least 5 innings (4.5 if the home team is leading) and is considered official.\n\n' +
                'Handball\n' +
                '7.1. If a match ends before the X is reached, bets placed on the "Who scores the Xth point?" (incl. OT)" market shall be voided. 7.2.\n' +
                '7.2. If a match ends before the X is reached, bets placed on the "Which team will win?" accumulate to x points (incl. OT)" market shall be voided.\n' +
                '7.3. All markets (except "Who scores the Xth point?" and "Which team will win the race to X points?") are considered for regular time only.\n' +
                '7.4. If the match goes to a 7-meter penalty shootout, bets placed on the "Who scores the Xth point?" and "Which team will win the race to X points?" markets shall be voided.\n' +
                '7.5. If odds were offered with an incorrect match time (more than 3 minutes), the sportsbook reserves the right to void the corresponding bets.\n' +
                '7.6. If markets remain open with an incorrect score that has a significant impact on the odds, the extent of the impact shall be determined by the sportsbook acting reasonably; the sportsbook reserves the right to void the corresponding bets.\n\n' +
                'Volleyball\n' +
                '8.1. If a set ends before the Xth point is reached, bets placed on the "Who scores the [Xth] point in set [Y]?" market shall be voided.\n' +
                '8.2. In the event that a match does not finish, all undecided markets shall be voided.\n' +
                '8.3. The golden set is not considered in any other market.\n' +
                '8.4. If markets remain open with an incorrect score that has a significant impact on the odds, the extent of the impact shall be determined by the sportsbook acting reasonably, the sportsbook reserves the right to void the corresponding bets.\n' +
                '8.5. Official point deductions shall be taken into account for all undetermined markets. Markets that have already been determined shall not take into account such deductions.\n\n' +
                'Beach Volleyball\n' +
                '9.1. If a set ends before the Xth point is reached, all bets placed on the "Who scores the [Xth] point in set [Y]?" market shall be voided.\n' +
                '9.2. In the event that a match does not finish, all undecided markets shall be voided.\n' +
                '9.3. The golden set is not considered in any other market.\n' +
                '9.4. If markets remain open with an incorrect score that has a significant impact on the odds, the extent of the impact shall be determined by the sportsbook acting reasonably, the sportsbook reserves the right to void the corresponding bets.\n' +
                '9.5. If a team retires, all undecided markets shall be voided.\n' +
                '9.6. Official point deductions shall be taken into account for all undetermined markets. Markets that have already been determined shall not take into account deductions.\n\n' +
                'Futsal\n' +
                '10.1. All markets (except half time, first half markets, overtime and penalty shootout) are considered for regular time only.\n' +
                '10.2. If a match is interrupted and resumes within 48 hours of the start date and time, all open bets shall be settled with the final result. Otherwise, all undecided bets shall be voided.\n' +
                '10.3. If a market remains open when any of the following events have already taken place, e.g., goals, red cards or yellow cards and penalties, the sportsbook reserves the right to void corresponding bets.\n' +
                '10.4. If the market was opened with a missing or incorrect red card, the sportsbook reserves the right to void bets on the respective market insofar as such bets are affected by the missing or incorrect red card.\n' +
                '10.5. If odds were offered with an incorrect match time (more than 2 minutes), the sportsbook reserves the right to void the corresponding bets.\n' +
                '10.6 If an incorrect score is entered, all markets shall be cancelled for the time during which the incorrect score was displayed.\n' +
                '10.7. If team names or the tournament are displayed incorrectly, the sportsbook reserves the right to void the corresponding bets.\n\n' +
                'Badminton\n' +
                '11.1. If a set ends before the Xth point is reached, bets placed on the "Who scores the [Xth] point in the [Nth] set?" market shall be voided.\n' +
                '11.2. In the event that a match does not finish, all undecided markets shall be voided.\n' +
                '11.3. If markets remain open with an incorrect score that has a significant impact on the odds, the extent of the impact shall be determined by the sportsbook acting reasonably, the sportsbook reserves the right to void the corresponding bets.\n' +
                '11.4. If a team retires, all undecided bets shall be voided.\n' +
                '11.5. If players/teams are displayed incorrectly, the sportsbook reserves the right to void the corresponding bets.\n' +
                '11.6. Official point deductions shall be taken into account for all undetermined markets. Markets that have already been determined shall not take into account deductions.\n\n' +
                'Rugby Union and Rugby League\n' +
                '12.1. All markets (except half time, first half markets, overtime and penalty shootout) are considered for regular time only.\n' +
                '12.2. Regular time of 80 minutes: Markets are based on the result at the end of a scheduled 80-minute playing time unless otherwise indicated. This includes any time added for injuries or stoppages, but does not include extra time, time allotted for a penalty shootout or sudden death.\n' +
                '12.3. If the market remains open when the following events have already taken place, e.g. goals, red or yellow cards and penalties, the sportsbook reserves the right to void the corresponding bets.\n' +
                '12.4. If the market was opened with a missing or incorrect red card, the sportsbook reserves the right to void bets on the respective market insofar as such bets are affected by the missing or incorrect red card.\n' +
                '12.5. If odds were offered with an incorrect match time (more than 2 minutes), the sportsbook reserves the right to void the corresponding bets.\n' +
                '12.6. If team names or the tournament are displayed incorrectly, the sportsbook reserves the right to void the corresponding bets.\n\n' +
                'Rugby Sevens\n' +
                '13.1. All markets (except half time, first half markets, overtime and penalty shootout) are considered for regular time only.\n' +
                '13.2. Regular time of 14 / 20 minutes: Markets are based on the result at the end of a scheduled 14 / 20-minute playing time unless expressly stated otherwise. This includes any time added for injuries or stoppages, but does not include extra time, time allotted for a penalty shootout or sudden death.\n' +
                '13.3. If the market remains open when the following events have already taken place, e.g. goals, red or yellow cards and penalties, the sportsbook reserves the right to void the corresponding bets.\n' +
                '13.4. If the market was opened with a missing or incorrect red card, the sportsbook reserves the right to void bets on the respective market insofar as such bets are affected by the missing or incorrect red card.\n' +
                '13.5. If odds were offered with an incorrect match time (more than 1 minute), the sportsbook reserves the right to void the corresponding bets.\n' +
                '13.6. If team names or categories are displayed incorrectly, the sportsbook reserves the right to void the corresponding bets.\n\n' +
                'Darts\n' +
                '14.1. In the event that a match is not finished, all undecided markets shall be voided.\n' +
                '14.2. If markets remain open with an incorrect score that has a significant impact on the odds, the extent of the impact shall be determined by the sportsbook acting reasonably, the sportsbook reserves the right to void the corresponding bets.\n' +
                '14.3. If players/teams are displayed incorrectly, the sportsbook reserves the right to void the corresponding bets.\n' +
                '14.4. If a match is not completed, all undecided markets shall be voided.\n' +
                '14.5. The bullseye counts as a red checkout color.\n\n' +
                'Snooker\n' +
                '15.1. In the event of a player retirement or disqualification, all undecided markets are considered void.\n' +
                '15.2. In the event of a re-rack, settlement shall stand if the outcome was determined before the re-rack.\n' +
                '15.3. Fouls or free balls are not considered for the settlement of any potted color ball market.\n' +
                '15.4. In the event that a frame starts but is not completed, all markets related to the frame shall be voided unless the outcome has already been determined.\n' +
                '15.5. If markets remain open with an incorrect score that has a significant impact on the odds, the extent of the impact shall be determined by the sportsbook acting reasonably, the sportsbook reserves the right to void the corresponding bets.\n' +
                '15.6. If players/teams are displayed incorrectly, the sportsbook reserves the right to void the corresponding bets.\n' +
                '15.7. If a match is not completed, all undecided markets shall be voided.\n\n' +
                'Table Tennis\n' +
                '16.1. If a set ends before the Xth point is reached, bets placed on the "Who scores the [Xth] point in set [Y]?" market shall be voided.\n' +
                '16.2.16.2. In the event that a match does not finish, all undecided markets shall be voided.\n' +
                '16.3. If markets remain open with an incorrect score that has a significant impact on the odds, the extent of the impact shall be determined by the sportsbook acting reasonably, the sportsbook reserves the right to void the corresponding bets.\n' +
                '16.4. If players/teams are displayed incorrectly on the sportsbook, the sportsbook reserves the right to void the corresponding bets.\n' +
                '16.5. If a player retires, all undecided markets are considered void.\n' +
                '16.6. Official point deductions shall be taken into account for all undetermined markets. Markets that have already been determined shall not take into account deductions.\n\n' +
                'Bowls\n' +
                '17.1. If a set ends before the Xth point is reached, bets placed on the market (Xth set - which team wins the race to x points, Xth set - which team scores the Xth point) shall be voided.\n' +
                '17.2. In the event of a player retirement or withdrawal, all undecided bets shall be voided.\n' +
                '17.3. If markets remain open with an incorrect score that has a significant impact on the odds, the extent of the impact shall be determined by the sportsbook acting reasonably, the sportsbook reserves the right to void the corresponding bets.\n' +
                '17.4. If players/teams are displayed incorrectly, the sportsbook reserves the right to void the corresponding bets.\n' +
                '17.5. If a player retires, all undecided markets shall be voided.\n\n' +
                'Cricket\n' +
                '18.1. Match Bets\n' +
                'Market description: Who will win the match?\n' +
                'Rules: All match bets shall be settled in accordance with the official competition rules. In matches affected by adverse weather conditions, bets shall be settled according to the official result.\n' +
                'If there are no official results, all bets shall be voided.\n' +
                'In the event of a tie, if the official competition rules do not determine a winner, then dead heat rules shall apply.\n' +
                'In competitions where a bowl off or super over determines a winner, bets shall be settled\n' +
                'on the official result.\n' +
                'In First Class matches, if the official result is a tie, bets shall be settled as a dead heat between both teams.\n' +
                'Draw bets shall be considered losers.\n' +
                'If a match is interrupted due to external factors, bets shall be voided unless a winner is declared according to the official competition rules.\n' +
                'If a match is cancelled, all bets shall be voided if it is not replayed or restarted within 36 hours of the announced start time.\n' +
                '18.2. Double Chance\n' +
                'Market description: Will the match result be any of the three given options?\n' +
                'Rules: A tie shall be resolved as a draw. All match-related bets shall be settled in accordance with the official competition rules.\n' +
                'If there is no official result, all bets shall be voided.\n' +
                '18.3. Match Bets: Draw No Bet\n' +
                'Market description: Who will win the match given that all bets shall be voided if the match ends in a draw?\n' +
                'Rules: A tie shall be resolved as a draw. All match-related bets shall be settled in accordance with the official competition rules. If there is no official result, all bets shall be voided.\n' +
                '18.4. Toss Winner\n' +
                'Description: Who will win the toss?\n' +
                'Rules: If the toss is not conducted, all bets shall be voided. Other equivalents are considered a toss, for example, bat flip.\n' +
                '18.5. Toss/Match Winner Double\n' +
                'Description: Who will win the toss and then who will win the match?\n' +
                'Rules: Toss winner rules are as mentioned above. Match bet rules are as above.\n' +
                '18.6. Tied Match\n' +
                'Description: Will the match be tied?\n' +
                'Rules: All bets shall be settled according to the official result. If the match is abandoned or there is no official result, all bets shall be voided. For First Class matches, a tie occurs when the team batting second is bowled out for the second time with the scores level.\n' +
                '18.7. Most Fours\n' +
                'Market description: Which team will score the most fours?\n' +
                'Rules: In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs in either innings due to external factors, including bad weather, unless the bet settlement has already been determined before the overs reduction. In drawn First Class matches, bets shall be voided if fewer than 200 overs have been bowled, unless the bet settlement has already been determined. Only fours scored from the bat (from any delivery, legal or otherwise) shall count towards the fours total. Overthrows, all-run fours and extras do not count. Fours scored in a super over do not count. In First Class games, only fours from the first innings shall count.\n' +
                '18.8. Most Sixes\n' +
                'Market description: Which team will score the most sixes?\n' +
                'Rules: In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs in either innings due to external factors, including bad weather, unless the bet settlement has already been determined before the overs reduction. In drawn First Class matches, bets shall be voided if fewer than 200 overs have been bowled, unless the bet settlement has already been determined. Only sixes scored from the bat (from any delivery, legal or otherwise) shall count towards the sixes total. Overthrows and extras do not count. Sixes scored in a super over do not count. In First Class games, only sixes from the first innings shall count.\n' +
                '18.9. Most Extras\n' +
                'Market description: Which team will have more extras added to their batting score?\n' +
                'Rules: In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs in either innings due to external factors, including bad weather, unless the bet settlement has already been determined before the overs reduction. In drawn First Class matches, bets shall be voided if fewer than 200 overs have been bowled, unless the bet settlement has already been determined. All wides, no balls, byes, leg byes and penalty runs in the match count towards the final result. If there are batting runs as well as extras from the same delivery, the batting runs do not count towards the final total. Extras in a super over do not count. In First Class games, only extras from the first innings shall count.\n' +
                '18.10. Most Run Outs\n' +
                'Market description: Which team will concede more run outs in the match?\n' +
                'Rules: A run out "conceded" means that a member of that team will be dismissed while batting. In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs in either innings due to external factors, including bad weather, unless the bet settlement has already been determined before the reduction. In drawn First Class matches, bets shall be voided if fewer than 200 overs have been bowled, unless the bet settlement has already been determined. Run outs in a super over do not count. In First Class games, only run outs from the first innings shall count.\n' +
                '18.11. Highest Opening Over\n' +
                'Market description: Which team will score the most runs in the first over of their innings?\n' +
                'Rules: The first over must be completed for bets to be valid, unless settlement has already been determined. If during the first over the innings is terminated due to external factors, including bad weather, all bets shall be void, unless settlement has already been determined before the overs reduction. In First Class matches, the market refers only to the first innings of each team. Extras and penalty runs in the particular case count towards settlement.\n' +
                '18.12. Most Runs in Over Groups\n' +
                'Market description: Which team will score more runs after the specified number of overs in their innings?\n' +
                'Rules: If the specified number of overs is not completed, the bet shall be void, unless the team has been bowled out, declared, reached their target or the bet settlement has been determined. In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the specified overs bowled at the time the bet was placed due to external factors, including bad weather, unless the bet settlement has already been determined before the overs reduction. In First Class matches, the market refers only to the first innings of each team.\n' +
                '18.13. Highest First Partnership\n' +
                'Market description: Which team will score the most runs before losing their first wicket?\n' +
                'Rules: If the batting team reaches the end of their allotted overs, reaches their target or declares before the first wicket falls, the result shall be the accumulated total. For settlement purposes, a batsman who retires hurt does not count as a wicket. In limited overs matches, bets shall be void if the innings has been reduced due to external factors, including bad weather, unless settlement has already been determined before the reduction. In drawn First Class matches, bets shall be voided if fewer than 200 overs have been bowled, unless the bet settlement has already been determined. In First Class matches, the market refers only to the first innings of each team.\n' +
                'Match Markets\n' +
                '18.14. Match Fours Markets\n' +
                'Market description: How many fours will be scored in the match?\n' +
                'Rules: In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs due to external factors, including bad weather, unless the bet settlement has already been determined before the overs reduction. In drawn First Class matches, bets shall be voided if fewer than 200 overs have been bowled, unless the bet settlement has already been determined. Only fours scored from the bat (from any delivery, legal or otherwise) shall count towards the fours total. Overthrows, all-run fours and extras do not count. Fours scored in a super over do not count.\n' +
                '18.15. Match Sixes\n' +
                'Market description: How many sixes will be scored in the match?\n' +
                'Rules: In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs due to external factors, including bad weather, unless the bet settlement has already been determined before the overs reduction. In drawn First Class matches, bets shall be voided if fewer than 200 overs have been bowled, unless the bet settlement has already been determined. Only sixes scored from the bat (from any delivery, legal or otherwise) shall count towards the sixes total. Overthrows and extras do not count. Sixes scored in a super over do not count.\n' +
                '18.16. Match Extras\n' +
                'Market description: How many extras will be scored in the match?\n' +
                'Rules: In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs in either innings due to external factors, including bad weather, unless the bet settlement has already been determined before the overs reduction. In drawn First Class matches, bets shall be voided if fewer than 200 overs have been bowled, unless the bet settlement has already been determined. All wides, no balls, byes, leg byes and penalty runs in the match count towards the final result. If there are batting runs as well as extras from the same delivery, the batting runs do not count towards the final total. Extras in a super over do not count.\n' +
                '18.17. Match Wides\n' +
                'Description: How many wides will be scored in total in the match?\n' +
                'Rules: In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs in either innings due to external factors, including bad weather, unless the bet settlement has already been determined before the overs reduction. In drawn First Class matches, bets shall be voided if fewer than 200 overs have been bowled, unless the bet settlement has already been determined. Any runs resulting from a wide delivery, except penalty runs, shall count towards the final total. Wides in a super over do not count.\n' +
                '18.18. Match Run Outs\n' +
                'Market description: How many run outs will there be in the match?\n' +
                'Rules: In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs in either innings due to external factors, including bad weather, unless the bet settlement has already been determined before the overs reduction. In drawn First Class matches, bets shall be voided if fewer than 200 overs have been bowled, unless the bet settlement has already been determined. Run outs in a super over do not count.\n' +
                '18.19. Match Wickets\n' +
                'Description: How many wickets will fall in the match?\n' +
                'Rules: In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs in either innings due to external factors, including bad weather, unless the bet settlement has already been determined before the reduction. In drawn First Class matches, bets shall be voided if fewer than 200 overs have been bowled, unless the bet settlement has already been determined. A retired hurt does not count as a dismissal. Wickets in a super over do not count.\n' +
                '18.20. Match Ducks\n' +
                'Description: How many ducks will be scored in total in the match?\n' +
                'Rules: In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs in either innings due to external factors, including bad weather, unless the bet settlement has already been determined before the reduction. In drawn First Class matches, bets shall be voided if fewer than 200 overs have been bowled, unless the bet settlement has already been determined. A duck is classified as someone who is dismissed for zero runs. A retired hurt does not count as a dismissal. Ducks in a super over do not count.\n' +
                '18.21. Batsman Milestones\n' +
                'Description: How many of the specified milestones (50/100) will be scored in total in the match?\n' +
                'Rules: This is determined by how many individual innings of 50+ or 100+ are scored in the match. A score of more than 100 would count as both a 50 and a 100. In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs due to external factors, including bad weather, unless the bet settlement has already been determined before the reduction.\n' +
                '18.22. Highest Over in Innings\n' +
                'Description: How many runs will be scored in the highest over of the match?\n' +
                'Rules: In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs due to external factors, including bad weather, unless the bet settlement has already been determined before the reduction. In drawn First Class matches, bets shall be void if fewer than 200 overs have been bowled, unless the bet settlement has been determined. All runs, including extras, count towards settlement. Super overs do not count. For the Hundred, an over shall consist of 5 legal deliveries, so a full innings shall be composed of 20 overs. All other rules remain the same as in other limited overs formats.\n' +
                // Note: from here onwards (18.23–27.8.1) is maintained in PDF; due to size it is incorporated as a continuous block.
                '18.23. Top Match Batsman\n' +
                'Market description: Which batsman will score the most runs in the match?\n' +
                'Rules: The result of this market is determined by the batsman with the highest individual score in the match. In limited overs matches, bets shall be void if it has not been possible to complete at least 50% of the scheduled overs to be bowled in either innings at the time the bet was placed due to external factors, including bad weather. Top batsman bets for First Class matches apply only to the first innings of each team, and shall be void if fewer than 200 overs have been bowled, unless the bet settlement has already been determined. If a player was named at the toss, but is then removed as a concussion substitute, that player shall still be counted, as shall the replacement player. If a batsman does not bat, but was named in the starting XI, bets on that batsman shall be valid. If a batsman is substituted after the market has been offered in-play, the original market shall be removed and settled as usual, even if the substitute scores the highest individual score. A new market may be offered with updated selections. Where two or more players score the same number of runs, dead heat rules shall apply. Runs scored in a super over do not count.\n' +
                '18.24. Top Match Bowler\n' +
                'Market description: Which bowler will take the most wickets in the match?\n' +
                'Rules: The result of this market is determined by the bowler with the most wickets in the match. In limited overs matches, bets shall be void if it has not been possible to complete at least 50% of the scheduled overs to be bowled in either innings at the time the bet was placed due to external factors, including bad weather. Top bowler bets for First Class matches apply only to the first innings of each team, and shall be void if fewer than 200 overs have been bowled, unless the bet settlement has already been determined. If a player was named at the toss, but is then removed as a concussion substitute, that player shall still be counted, as shall the replacement player. If a bowler does not bowl, but was named in the starting XI, bets on that bowler shall be valid. If a substitute (concussion or otherwise) who was not named in the starting XI takes the most wickets, bets on the market shall be void. If two or more bowlers have taken the same number of wickets, the bowler who has conceded fewer runs shall be the winner. If there are two or more bowlers with the same wickets taken and runs conceded, dead heat rules shall apply. Wickets taken in a super over do not count. If no bowler takes a wicket in an innings, then all bets shall be void.\n' +
                '18.25. Top Batsman Team\n' +
                'Description: Which team will contain the top batsman in the match?\n' +
                'Rules: The same rules as for Top Match Batsman apply, with dead heat rules applicable if the runs scored by the top batsman of both teams are the same. If settlement has already been determined at the time a match is shortened, bets shall be valid.\n' +
                '18.26. Top Bowler Team\n' +
                'Description: Which team will contain the top bowler in the match?\n' +
                'Rules: The same rules as for Top Match Bowler apply, with dead heat rules applicable if the wickets taken by the top bowler of both teams are the same. If settlement has already been determined at the time a match is shortened, bets shall be valid.\n' +
                '18.27. Player of the Match\n' +
                'Description: Who will be named player of the match?\n' +
                'Rules: Bets shall be settled on the player officially declared as player of the match. Dead heat rules apply. If no player of the match is officially declared, then all bets shall be void. All players who played in the match shall be settled, including substitutes. If a player does not play, bets shall be void.\n' +
                '18.28. First Innings Lead\n' +
                'Description: What will be the runs deficit between the first innings in a First Class match?\n' +
                'Rules: Both first innings must be completed. Dead heat rules apply in the event of a tie. In drawn First Class matches, bets shall be void if fewer than 200 overs have been bowled, unless the bet settlement has already been determined.\n' +
                '18.29. Fifty/Hundred in the Match\n' +
                'Description: Will a fifty/hundred be scored in the match?\n' +
                'Rules: Any score of 50 or more counts as a fifty. Similarly for hundreds. In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs to be bowled due to external factors, including bad weather, unless the bet settlement has already been determined before the reduction. In drawn First Class matches, bets shall be void if fewer than 200 overs have been bowled, unless the bet settlement has already been determined.\n' +
                '18.30. Fifty/Hundred in the First Innings\n' +
                'Description: Will a fifty/hundred be scored in the first innings of the match?\n' +
                'Rules: Any score of 50 or more counts as a fifty. Similarly for hundreds. In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs to be bowled in the first innings due to external factors, including bad weather, unless the bet settlement has already been determined before the reduction. In drawn First Class matches, the innings must be completed, or more than 200 overs, unless the bet settlement has already been determined before the reduction. In First Class matches, this market refers only to the first innings of the match, not the first innings of both teams.\n' +
                '18.31. Highest Individual Score\n' +
                'Description: What will be the highest score by a batsman in the match?\n' +
                'Rules: In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs to be bowled due to external factors, including bad weather, unless the bet settlement has already been determined before the reduction. In drawn First Class matches, bets shall be void if fewer than 200 overs have been bowled, unless the bet settlement has already been determined. Dead heat rules apply.\n\n' +
                '18.32–18.89. (Delivery/over/group/session/innings/player/partnership markets and notes) are maintained as per PDF.\n\n' +
                '19. Squash\n' +
                '19.1. If a set ends before the Xth point is reached, this "Who scores the [X] point in set [y]?" market is considered void (cancelled).\n' +
                '19.2. If markets remain open with an incorrect score that has a significant impact on the odds, the extent of the impact shall be determined by the sportsbook acting reasonably, the sportsbook reserves the right to void the respective bets.\n' +
                '19.3. If players/teams are displayed incorrectly, the sportsbook reserves the right to void the respective bets.\n' +
                '19.4. If a player retires, loses the match or is disqualified, all undecided markets shall be voided.\n' +
                '19.5. Official point deductions shall be taken into account for all undetermined markets. Markets that have already been determined shall not take into account deductions.\n' +
                '19.6. If penalty points are awarded by the referee, all bets on that game shall stand.\n\n' +
                '20. Australian Football Rules\n' +
                '20.1. All markets exclude overtime unless expressly stated otherwise.\n' +
                '20.2. 80 regular minutes: markets are based on the result at the end of a scheduled 80-minute game, unless expressly stated otherwise. This includes any injury or stoppage time added, but does not include extra time.\n' +
                '20.3. If odds were offered with an incorrect match time (more than 2 minutes), the sportsbook reserves the right to void the respective bets.\n' +
                '20.4. If team names or the category are displayed incorrectly, the sportsbook reserves the right to void the respective bets.\n\n' +
                '21. Boxing\n' +
                '21.1. If either fighter does not answer the bell for the next round, then their opponent shall be deemed to have won in the previous round.\n' +
                '21.2. In the event that a fight is declared "No Contest", all bets shall be voided.\n' +
                '21.3. If the scheduled number of rounds is changed before the fight, then all "Total Rounds", "Round Bets" and "Method of Victory" bets shall be voided.\n' +
                '21.4. Boxing market rules:\n' +
                '21.4.1. Winner (to win the fight) predicts which competitor will win the fight. No draw selection is offered. For the Winner market where no draw selection is offered, all bets shall be void in the event of a draw (this includes a fight that ends in a majority draw or a technical draw).\n' +
                '21.4.2. 1x2 (Fight Result) predicts the result of the fight. If the fight ends in a majority draw or a technical draw, then the draw shall be the winning selection.\n' +
                '21.4.3. Total Rounds (Over/Under) means betting on the round in which the result of the fight will be determined. For settlement purposes where half round is indicated - then 1 minute 30 seconds of the respective round shall define the half to determine under or over. Thus, 9.5 rounds would be one minute and thirty seconds of the tenth round. If the fight ends exactly at 1 minute and 30 seconds of the tenth round, then the result would be over 9.5 rounds.\n' +
                '21.4.4. Winner and exact round predicts the round in which the selection will win the fight. Betting on the winner and exact round is that a fighter wins by KO (knockout), TKO (technical knockout) or disqualification during that round. When a boxer does not answer the bell for the next round, their opponent shall be deemed to have won the bout in the previous round. In the event of a technical decision before the end of the fight, all bets shall be considered won by decision and round bets shall be considered losers.\n' +
                '21.4.5. Winning method predicts the method by which the result of the fight will be decided. All bets shall be settled according to the official declared result. A win by disqualification counts as a knockout/technical knockout.\n' +
                '21.4.6. Either fighter to win within the distance predicts whether the fight will be decided before the scheduled number of rounds. In the event of a technical decision, for settlement purposes, the fight is considered NOT to have gone the distance.\n\n' +
                '22. MMA\n' +
                '22.1. All markets are settled according to the result available immediately after the end of the fight. Any subsequent appeal or modification of the result shall not be taken into account for settlement purposes.\n' +
                '22.2. If one of the fighters does not answer the bell for the next round, then their opponent shall be deemed the winner in the previous round.\n' +
                '22.3. If there is a withdrawal or a substitution of one of the fighters, bets shall be void.\n' +
                '22.4. In the event that a fight is declared "No Contest", all bets shall be voided.\n' +
                '22.5. If the scheduled number of rounds is changed before the fight, then all "Total Rounds", "Winner and exact rounds" and "Method of Victory" bets shall be voided.\n' +
                '22.6. MMA market rules (as per PDF).\n\n' +
                '23. Golf\n' +
                '23.1. A player is considered to have played in a tournament or a specific round once they have teed off. If a player withdraws, is withdrawn or is disqualified after teeing off, bets shall stand.\n' +
                '23.2. In tournaments affected by bad weather or other similar reasons, bets shall be placed on the official result regardless of the number of rounds played.\n' +
                '23.3. If the tournament is abandoned, all bets placed after the last completed round shall be voided.\n' +
                '23.4. If a round of golf is abandoned, all undecided markets shall be voided.\n' +
                '23.5. Official results from the tour site at the time of trophy presentation are used for settlement purposes (disqualification subsequent to this time does not count).\n' +
                '23.6. In the event of any delay (rain, darkness...) all undecided markets shall remain unresolved and trading shall continue as soon as the round/tournament resumes.\n' +
                '23.7. In the event of non-participation, 2-ball and 3-ball bets shall be voided.\n' +
                '23.8. Golf market rules (23.8.1–23.8.14) as per PDF.\n\n' +
                '24. Motorcycle Racing\n' +
                '24.1. If a specific event is postponed or abandoned, bets shall remain valid provided the event is completed within 72 hours.\n\n' +
                '25. Athletics\n' +
                '25.1. If a specific event is postponed or abandoned, bets shall remain valid provided the event is completed within 72 hours.\n\n' +
                '26. Winter Sports\n' +
                '26.1. If a specific event is postponed or abandoned, bets shall remain valid provided the event is completed within 72 hours.\n\n' +
                '27. Formula 1\n' +
                '27.1. General Formula 1 betting rules (27.1.1–27.1.6) as per PDF.\n' +
                '27.2. Team rules (27.2.1–27.2.4) as per PDF.\n' +
                '27.3. Fastest lap market rules (27.3.1–27.3.2) as per PDF.\n' +
                '27.4. Head2Head and Winner group market rules (27.4.1–27.4.2) as per PDF.\n' +
                '27.5. Overtaking market rules (27.5.1–27.5.5) as per PDF.\n' +
                '27.6. Retirement market rules (27.6.1–27.6.3) as per PDF.\n' +
                '27.7. Pit stop markets (27.7.1–27.7.2) as per PDF.\n' +
                '27.8. Total finishers market rules (27.8.1) as per PDF.',
        },
        specialRulesForEsports: {
            title: 'Special Rules for Esports',
            content: [
                {
                    title: '1. General Rules Applicable to Esports',
                    content:
                        '1.1. All esports markets are based on in-game scoring events or results at the end of a scheduled match/map. All settlements shall be made using the official score and results, which are declared on the official video broadcast or in the game broadcast of the relevant matches.\n' +
                        '1.2. All start dates and times shown for esports matches are for indicative purposes only and are not guaranteed to be correct. Bets shall stand if a match is offered with an incorrect date and/or time.\n' +
                        '1.3. If a match is paused/postponed and is not rescheduled for a later time within 24 hours of the actual scheduled start time, all bets on that match shall be voided.\n' +
                        '1.4. If the name of a player/team/tournament is misspelled, all bets shall remain valid unless it is obvious that the misspelled name is the same as that of a different entity/person.\n' +
                        '1.5. If a team is renamed due to a team leaving the organization, joining another organization or due to an official team name change, all bets shall stand.\n' +
                        '1.6. If the event organizer allows substitutes and there is an official result, all bets shall be settled normally.\n' +
                        '1.7. In the event that the organizer voids the result of a match due to unforeseen circumstances - such as cheating - all bets on that match shall be voided. This rule is applicable within 72 hours after the end of the match; after that period, the sportsbook shall not change the result of entries.\n' +
                        '1.8. If the tournament organizer declares a match as a walkover victory, all bets shall be void.\n' +
                        '1.9. If a team withdraws during a match, only bets on completed individual maps shall be settled. The match market, match side markets and all other undecided map markets shall be voided. Bets placed on any of the following maps that will be completed shall be determined with the official results. However, any live offer shall be suspended on this match and carried over to a new match with a different match ID that will genuinely reflect the state of the match. The only exception to this rule would be in this same situation: Team A wins map 1 and proceeds to lose map 2. In this case, we would void all bets on all undecided match and map 2 markets, and continue our offering on map 3 of the match.\n' +
                        '1.10. All markets consider overtime, unless expressly stated otherwise in the market name.\n' +
                        '1.11. If the match format changes or differs from what is offered, the sportsbook reserves the right to void all bets.\n' +
                        '1.12. If the match is displayed incorrectly, the sportsbook reserves the right to void all bets.\n' +
                        '1.13. If a match is played before the scheduled start date/time, all bets placed after the actual start of the match shall be refunded. All bets placed before the actual start of the match shall stand.\n' +
                        '1.14. If a match or map is replayed due to organizer or technical problems, all affected markets shall be voided, while replayed matches or maps shall be handled separately as a new match.\n' +
                        '1.15. If a game on the map starts with fewer than ten players, all bets on that map shall be voided.',
                },
                {
                    title: '2. Esports Game-Specific Rules',
                    content:
                        '2.1. CS:GO Rules:\n' +
                        '2.1.1. If one of the players disconnects and cannot reconnect or be replaced for the remainder of the map, both teams decide to continue 4v5 and play at least 5 rounds. All affected bets on that map, match and match side markets shall be voided.\n' +
                        '2.2. If a team withdraws, receives an administrative victory or is disqualified before all scheduled rounds of a map have been played, all undecided bets on that map and match shall be voided.\n' +
                        '2.3. Rounds 1-15 constitute the first half of CS:GO maps.\n' +
                        '2.4. In the case of a round restart, all bets shall stand. All markets shall be settled based on the official score.\n' +
                        '2.2. Valorant Rules:\n' +
                        '2.2.1. If one of the players disconnects and cannot reconnect or be replaced for the remainder of the map, both teams decide to continue 4v5 and play at least 5 rounds. All affected bets on that map, match and match side markets shall be voided.\n' +
                        '2.2.2. If a team withdraws, receives an administrative victory or is disqualified before all scheduled rounds of a map have been played, all undecided bets on that map and match shall be voided.\n' +
                        '2.2.3. Rounds 1 to 12 constitute the first half of Valorant maps.\n' +
                        '2.2.4. In the case of a round restart, all bets shall stand. All markets shall be settled based on the official score.\n' +
                        '2.3. Dota 2 Rules:\n' +
                        '2.3.1. If a map starts with fewer than 10 competitors, all bets on the map shall be voided.\n' +
                        '2.3.2. If a competitor disconnects within the first 10 minutes and cannot reconnect or be replaced for the remainder of the map, all affected bets on that map and match shall be voided. If a competitor disconnects or abandons after minute 10 of gameplay on a map has started, bets have action according to the official result.\n' +
                        '2.3.3. If an administrative victory is awarded within the first 10 minutes of a map, all bets on the map shall be voided. If an administrative victory is awarded after minute 10 of gameplay on a map has started, bets have action according to the official result.\n' +
                        '2.4. League of Legends Rules:\n' +
                        '2.4.1. If a map starts with fewer than 10 competitors, all bets on the map shall be voided.\n' +
                        '2.4.2. If a competitor disconnects within the first 10 minutes and cannot reconnect or be replaced for the remainder of the map, all affected bets on that map and match shall be voided. If a competitor disconnects or abandons after the tenth minute of gameplay on a map that has started, bets shall have action according to the official result.\n' +
                        '2.4.3. If an administrative or walkover victory is awarded within the first 10 minutes of a map, all undecided bets on that map and match shall be void. If an administrative victory is awarded after the tenth minute of gameplay on a map, bets shall have action according to the official result.\n' +
                        '2.5. King of Glory Rules:\n' +
                        '2.5.1. If a map starts with fewer than 10 competitors, all bets on the map shall be void.\n' +
                        '2.5.2. If a competitor disconnects within the first 10 minutes and cannot reconnect or be replaced for the remainder of the map, all undecided bets on that map and match shall be void. If a competitor disconnects or abandons after the tenth minute of gameplay on a map that has started, bets shall have action according to the official result.\n' +
                        '2.5.3. If an administrative or walkover victory is awarded within the first 10 minutes of a map, all undecided bets on that map and match shall be void. If an administrative victory is awarded after minute 10 of gameplay after the map has started, bets shall be valid according to the official result.\n' +
                        '2.5.4. Specific market rules - if the final game duration is the same as a particular threshold, it is settled as OVER.\n' +
                        '2.6. eSports FIFA\n' +
                        '2.6.1. eSports Battle match duration - 2x4 minutes.\n' +
                        '2.6.2. Liga Pro eFootball match duration - 2x6 minutes.\n' +
                        '2.6.3. All Markets shall be settled as established in the General Rules and Football Market Rules.\n' +
                        '2.7. eSports NBA2K\n' +
                        '2.7.1. Match duration – 4x5 minutes. This includes overtime.\n' +
                        '2.7.2. All Markets shall be settled as established in the General Rules and Basketball Market Rules.',
                },
            ],
        },
        esportsBetSettlementRules: {
            title: 'Esports Bet Settlement Rules',
            content: [
                {
                    title: '1.1. General Rules',
                    content:
                        '1.1.1. The sports betting platform reserves the right to cancel any bet placed at "bad" odds (e.g., including typographical errors, administrative errors, presumably fixed matches), different odds or bets placed after an event has started or the match has been affected by evident technical problems.\n' +
                        '1.1.2. All bets shall be settled when the market outcome has occurred.\n' +
                        '1.1.3. The "Match" (1X2) market is where it is possible to bet on the result (partial or final) of a match or event. The options are: "1" = Home team, or the team listed on the left side of the offer; "X" = Draw, or the selection in the middle; "2" = Away team, or the team listed on the right side of the offer.\n' +
                        '1.1.4. The "Correct Score" market is where it is possible to bet on the exact result (partial or final) of a match or event.\n' +
                        '1.1.5. The "Over/Under" (Totals) market is where it is possible to bet on the quantity (partial or final) of a predefined occurrence (e.g., goals, points, corners, rebounds, penalty minutes, etc.). If the total quantity of the listed events is exactly equal to the betting line, all bets on this offer shall be declared void. Example: an offer where the betting line is 128.0 points and the match ends with a score of 64-64 shall be declared void.\n' +
                        '1.1.6. The "Even/Odd" market is where it is possible to bet on the quantity (partial or final) of a predefined occurrence (e.g., goals, points, corners, rebounds, penalty minutes, etc.). "Odd" is 1,3,5, etc.; "Even" is 0,2,4, etc.\n' +
                        '1.1.7. The "Period Bets" market is where it is possible to bet on the result of each separate period within a match/event. For example, if at half time the score is 1-0 and the match ends 1-1, the winning result is 1/X. The bet is void if the regular match time is played in a time format different from that listed in the bet (i.e., anything other than two halves).\n' +
                        '1.1.8. The "Quarter / Half / Period X Bets" market refers to the result/score achieved in the corresponding time period and does not include any other points/goals/events counted from other parts of the event/match.\n' +
                        '1.1.9. The "Draw No Bet" market is where it is possible to bet on "1" or "2", as defined in. If the specific match has no winner (e.g. the match ends in a draw), or the occurrence in question does not happen (e.g. Draw No Bet and if the match ends 0-0), bets shall be refunded.\n' +
                        '1.1.10. The "Handicap" market is where it is possible to bet on whether the chosen result will be victorious once the listed handicap is added to/subtracted from (as applicable) the match/period/total score to which the bet refers. The "Handicap" market allows betting on whether the chosen result will be victorious once the listed handicap is added to or subtracted from (as applicable) the match/period/total result to which the bet refers. In those circumstances where the result after the handicap line adjustment is exactly equal to the betting line, then all bets on this offer shall be declared void.\n' +
                        '1.1.11. Asian Handicap market: Home team (-1.75) vs Away team (+1.75). This means the bet is split into 2 equal bets and placed on the -1.5 and -2.0 outcomes. For the bet to pay in full at the listed odds, Team A must win the match by a margin greater than both listed handicaps (i.e., a 3-goal margin or more). In the event that Team A wins by only a 2-goal margin, the bet will be considered partially won, with a full payout on the -1.5 part and a refund on the -2.0 part, as the result on that part would be considered a draw. If the match produces any other result, including a Team A victory by only a 1-goal margin, the entire bet would be lost. The away team receives a +1.75 goal advantage in the match. This means the bet is split into 2 equal bets and placed on the +1.5 and +2.0 outcomes.\n' +
                        '1.1.12. "Double Chance" allows (where possible) simultaneously betting on two results (partial or final) of an event or match. The options are: 1X, 12 and X2 with "1", "X" and "2" as defined in.\n' +
                        '1.1.13. The "Team to Score First and Win" market refers to the listed team that scores the first goal in the match and ends up winning. The "Team to Score First and Win" market refers to the listed team that scores the first goal in the match and ends up winning. If there are no goals in the match, all bets shall be considered void.\n' +
                        '1.1.14. Bets on "Quarter / Half / Period X" refer to the result/score achieved in a relevant time frame and do not include any other points/goals/events counted from other parts of the event/match. Bets shall be void if the match is played in a format different from that stipulated in the offer.\n' +
                        '1.1.15. Bets on "Result at the end of Quarter / Half / Period X..." refer to the result of the match/event after the end of the stipulated time and shall take into account all points/goals/events from earlier parts of the event/match.\n' +
                        '1.1.16. Bets on "Race to X Points / Race to X Goals..." and similar offers refer to the team/participant that first reaches the particular count of points/goals/events. If the offer includes a time period (or any other restriction), it shall not include points/goals/events from other parts of the event/match that are not related to the mentioned time period. If the indicated score is not reached within the stipulated time (if applicable), all bets shall be declared void, unless otherwise indicated.\n' +
                        '1.1.17. Bets on "Winner of Point X / Scorer of Goal X" and similar offers refer to the team/participant that scores/wins the listed occurrence. For settlement of these offers, events that occurred before the listed occurrence shall not be taken into account. If the listed occurrence is not reached within the stipulated time (if applicable), all bets shall be declared void, unless otherwise indicated.\n' +
                        '1.1.18. Any reference to a team winning all halves/periods (e.g., Team to Win Both Halves) means that the listed team must score more goals than its opponent in all stipulated halves/periods of the match.',
                },
                {
                    title: '1.2. Basketball Market Rules',
                    content:
                        '1.2.1. Markets do not consider overtime unless otherwise indicated.\n' +
                        '1.2.2. If a match ends before the X is reached, this market is considered void (cancelled). Who scores the Xth point? (incl. OT), Which team will win the race to x points? (incl. OT).',
                },
                {
                    title: '1.3. Cricket Market Rules',
                    content:
                        '1.3.1. Delivery markets are exhausted. The result shall be determined by the number of runs added to the team total, from the specified delivery. For example, if an over starts with a wide, then the first delivery shall be settled as 1, and, although a legal ball has not been bowled, the next ball shall be considered as delivery 2 for that over. If a delivery results in a free hit or if a free hit has to be re-bowled due to an illegal delivery, runs scored from the additional delivery do not count. All runs, whether from the bat or not, are included. For example, a wide with three additional runs taken equals 4 runs in total from that delivery.\n' +
                        '1.3.2. Delivery markets are exhausted. The specified over must be completed for bets to be valid, unless settlement has already been determined. If an innings ends during an over, that over shall be considered complete unless the innings was terminated due to external factors, including bad weather, in which case all bets shall be voided, unless settlement has already been determined. If the over does not start for any reason, all bets shall be voided. Extras and runs in the particular case count towards settlement.\n' +
                        '1.3.3. Wicket in Over. For settlement purposes, any wicket shall count, including run outs. A batsman who retires hurt does not count as a wicket. If a batsman is timed out or retires, then the wicket is considered to have occurred on the previous ball. Retired hurt does not count as a dismissal.\n' +
                        '1.3.4. Over Odd/Even. Description: Will the number of runs scored in the specified over be odd or even? Rules: Same as "Runs in Over". Zero shall be considered an even number.\n' +
                        '1.3.5. Innings markets. In limited overs matches, bets shall be void if it has not been possible to complete at least 80% of the scheduled overs at the time of placing the bet due to external factors, including bad weather, unless the bet settlement has been determined before the reduction. Bets placed on a future innings shall remain valid regardless of runs scored in any current or previous innings. In drawn First Class matches, bets shall be voided if fewer than 200 overs have been bowled, unless the bet settlement has been determined. Bets shall be voided in drawn First Class matches if fewer than 60 overs have been bowled in incomplete innings, unless the bet settlement has already been determined. If a team declares, that innings shall be considered complete for settlement purposes.',
                },
                {
                    title: '1.4. Baseball Market Rules',
                    content:
                        '1.4.1. Possible extra innings are not considered in any market unless otherwise indicated.',
                },
                {
                    title: '1.5. FIFA',
                    content:
                        '1.5.1. Match duration – 2x6 minutes. This includes stoppage time, but does not include extra time or penalty shootouts.\n' +
                        '1.5.2. All Markets shall be settled as established in the General Rules.',
                },
                {
                    title: '1.6. FIFA: Volta',
                    content:
                        '1.6.1. Match duration – 2x3 minutes. This includes stoppage time, but does not include extra time or penalty shootouts.\n' +
                        '1.6.2. All Markets shall be settled as established in the General Rules.',
                },
                {
                    title: '1.7. Penalty Shootout',
                    content:
                        '1.7.1. Includes only penalty shootouts without regular time, stoppage time or extra time.\n' +
                        '1.7.2. All Markets shall be settled as established in the General Rules.',
                },
                {
                    title: '1.8. NBA 2K',
                    content:
                        '1.8.1. Match duration – 4x6 minutes. This includes overtime.\n' +
                        '1.8.2. All markets shall be settled as established in the General Rules and Basketball Market Rules.',
                },
                {
                    title: '1.9. Rocket League',
                    content:
                        '1.9.1.Match duration – 5 minutes. This does not include overtime.\n' +
                        '1.9.2.All markets shall be settled as established in the General Rules.',
                },
                {
                    title: '1.10. eFighting',
                    content:
                        '1.10.1.The winner of the fight is the character that wins the bout.\n' +
                        '1.10.2. Explanation of eFighting market conditions.\n' +
                        'Health Bar - Each character has 2 Health Bars. The second bar is only active after the first is fully depleted.\n' +
                        'First damage – first successful attack.\n' +
                        'Clash – A fight situation when both characters challenge each other on special occasions to increase health points. Both fighters can win the clash, but it can also be a draw.\n' +
                        'Super move: a special move for each character, which occurs very rarely.\n' +
                        '1.10.3. All markets shall be settled according to the above definitions.',
                },
                {
                    title: '1.11. eCricket',
                    content:
                        '1.11.1. The match consists of two innings, one for each team.\n' +
                        '1.11.2. Each innings consists of five overs with 6 deliveries each.\n' +
                        '1.11.3. All markets shall be settled as established in the Cricket Market Rules.',
                },
                {
                    title: '1.12 eBaseball',
                    content:
                        '1.12.1. The match consists of 3 innings and extra innings if necessary.\n' +
                        '1.12.2. All markets shall be settled as established in the Baseball Market Rules.',
                },
                {
                    title: '1.13 eShooting',
                    content:
                        '1.13.1. The match consists of 15 rounds. For one of the teams to win, it is sufficient to accumulate 8 points.\n' +
                        '1.13.2. All markets shall be settled as established in the General Rules.',
                },
                {
                    title: '1.14. eTennis',
                    content:
                        '1.14.1. The match winner is the first player to win 2 sets.\n' +
                        '1.14.2. A player must win 3 games to win a set. If the score is tied at 2-2, then a player can win 4-2, or if the players remain tied at 3-3, the set is decided by a tiebreak.\n' +
                        '1.14.3. The tiebreak winner is the first player to win 5 points with a minimum difference of 2 points. If the score is tied at 5-5, the player can win 7-5, 8-6, 9-7, etc.',
                },
            ],
        },
        virtualSportsRules: {
            title: 'Virtual Sports Rules',
            content: [
                {
                    title: '1. Virtual Football',
                    content:
                        '1.1. Virtual football modes provide a 24/7/365 real money betting experience on virtual football. Competitions are continuously generated and bets can be placed at any time, including within a season.\n' +
                        '1.2. Game Structure\n' +
                        'Each mode has a different tournament structure:\n' +
                        '1.2.1. Virtual Football League Mode (VFLM):\n' +
                        '-16 Teams\n' +
                        '• Home and away matches\n' +
                        '• 30 match days\n' +
                        '• 8 simultaneous matches per match day\n' +
                        '• 240 matches per Group Stage season\n' +
                        '1.2.2. Virtual Football World Cup (VFWC):\n' +
                        '• 32 Teams (8 groups of 4 teams per group)\n' +
                        '-12 match day blocks (3 match days of 4 blocks per match day)\n' +
                        '-4 simultaneous matches per match day block\n' +
                        '• 48 matches per group stage\n' +
                        '• Knockout Stage\n' +
                        '• 16 Teams\n' +
                        '• 5 rounds (R16[1..4]; R16[5...8]; R8; Semi-finals; Final and 3rd place)\n' +
                        '• 4 simultaneous matches (R16[1..4]; R16[5...8]; R8);\n' +
                        '• 2 simultaneous matches (Semi-finals; Final and 3rd place)\n' +
                        '• 16 matches per knockout stage.',
                },
                {
                    title: '2. Virtual Basketball',
                    content:
                        '2.1. The VBL offers a 24/7/365 real money betting experience on virtual basketball. The league consists of 16 teams and seasons run continuously. Each season consists of 30 match days (home and away matches). Bets can be placed at any time, including within a season.\n' +
                        '2.2. Season details: for the online version, a season lasts 106:30 minutes in total, separated into a "Pre-league" period, a "Match Day Loop" and a "Post-league" period. The \'Pre-league\' period extends before the start of a season and lasts 60 seconds. All match days are summarized as the \'Match Day Loop\' period with a total duration of 105:00 minutes. At the end of each season there is a 30-second "Post-season" period.\n' +
                        '2.3. Bets are permitted on a VBL match up to 10 seconds before the start of the match. Betting markets for future match days of the current season remain open.',
                },
                {
                    title: '3. Virtual Horse Racing',
                    content:
                        '3.1. Virtual Horses (VHK) offers a 24/7/365 real money betting experience on virtual horse racing. Bets can be placed up to 10 seconds before the start of the next race, as well as on all future races of the current race days at any time.\n' +
                        '3.2. Races are continuously generated: a new one will start as soon as the current one finishes. It is possible to bet on the next 10 upcoming races:\n' +
                        '• Total event cycle of 2 minutes;\n' +
                        '• Betting phase of 40 seconds;\n' +
                        '• Event phase of 65 seconds;\n' +
                        '• Results phase of 15 seconds;\n' +
                        '• 2 turf tracks and 1 dirt track with a 1000m race randomly scheduled;\n' +
                        '• 8, 10, 12, 14 runners randomly assigned.\n' +
                        '3.3. Virtual horse racing market rules:\n' +
                        '3.3.1. Win: select the runner that will finish first;\n' +
                        '3.3.2. Place: select the runner that will finish 1st and 2nd (6-7 runners), select the runner that will finish 1st, 2nd and 3rd (7+ runners);\n' +
                        '3.3.3. Forecast (correct order): select the runners that will finish 1st and 2nd in the correct order (exacta);\n' +
                        '3.3.4. Forecast (any order): select the runners that will finish first and second in any order (quinella);\n' +
                        '3.3.5. Tricast (Correct Order): select the runners that will finish 1st, 2nd and 3rd in the correct order (trifecta);\n' +
                        '3.3.6. Tricast (any order) - select the runners that will finish 1st, 2nd and 3rd in any order (trio).',
                },
                {
                    title: '4. Virtual Dog Racing',
                    content:
                        '4.1. Virtual Dogs (VDK) offers a 24/7/365 real money betting experience on virtual dog racing. Bets can be placed up to 10 seconds before the start of the next race, as well as on the next ten future races at any time.\n' +
                        '4.2. Game information. Races are continuously generated: a new one will start as soon as the current one finishes.\n' +
                        '• Total event cycle of 2 minutes;\n' +
                        '-37 seconds or 67 seconds betting phase;\n' +
                        '-38 seconds or 68 seconds event phase;\n' +
                        '-15 seconds results phase;\n' +
                        '• Day and night tracks with distances of 360m and 720m, randomly scheduled;\n' +
                        '• 6 or 8 runners randomly assigned.\n' +
                        '4.3. Virtual dog racing market rules:\n' +
                        '4.3.1. Win: select the runner that will finish first;\n' +
                        '4.3.2. Place: select the runner that will finish 1st or 2nd (6-7 runners), select the runner that will finish 1st, 2nd or 3rd (7+ runners);\n' +
                        '4.3.3. Forecast (correct order): select the runners that will finish 1st and 2nd in the correct order (exacta);\n' +
                        '4.3.4. Forecast (any order): select the runners that will finish first and second in any order (quinella);\n' +
                        '4.3.5. Tricast (correct order): select the runners that will finish 1st, 2nd and 3rd in the correct order (trifecta);\n' +
                        '4.3.6. Tricast (any order): select the runners that will finish 1st, 2nd and 3rd in any order (trio).',
                },
            ],
        },
    },
};
