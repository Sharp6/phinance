/*
TO DO:
 - csv reader should be promisified
*/

var csvParse = require('csv-parse');
var fs = require('fs');
var moment = require('moment');

var verrichtingDA = require('../dataAccess/verrichting.server.da');
var commandDA = require('../dataAccess/command.server.da');

exports.handleFile = function(filename) {
	return alreadyImported(filename).then(function(imported) {
		if(imported) {
			return console.log("File is already imported. Aborting.");
		} else {
			return executeHandling(filename);
		}
	});
}

function executeHandling(filename) {
	var fileToParse = {
		filename: filename
	}

	return determineBank(fileToParse)
		//.then(prepareFile)
		//.then(determineHeaders)
		//.then(addHeaders)
		//.then(fixNewlines)
		.then(prepareBelfiusFile)
		.then(prepareArgentaFile)
		.then(processFile)
		.then(mapDataFields)
		.then(prepareDataFields)
		.then(persistVerrichtingen);
		//.then(logCommand);
}

function alreadyImported(filename) {
	return new Promise(function(resolve,reject) {
		commandDA.searchCommand({commandType:'import file', filename: filename})
			.then(function(data) {
				if(data[0]) {
					resolve(true);
				} else {
					resolve(false);
				}
		});
	});
}

function prepareArgentaFile(fileToParse) {
	// For argenta files, the first line should be removed.
	return new Promise(function(resolve,reject) {
		if(fileToParse.bank === "argenta") {
			fs.readFile(fileToParse.filename, function(err, data) {
				if (err) {
					reject(err);
				} else {
					data = data.toString();
					if(data.substring(0,15) === "Nr v/d rekening") {
						var position = data.indexOf('\n');
						if (position == -1) {
							reject("No lines found in file.");
						} else {
							data = data.substr(position + 1);
							fs.writeFile(fileToParse.filename, data, function(err) { 
								if (err) { 
									reject(err);
								} else {
									console.log("Succesfully prepared file for argenta.");
									resolve(fileToParse);
								}
							});
						}	
					} else {
						console.log("File for argenta seems already prepared.");
						resolve(fileToParse);
					}
				}
			});
		} else {
			resolve(fileToParse);
		}
	});	
}

function prepareBelfiusFile(fileToParse) {
	// For belfius files, headers should be added.
	return new Promise(function(resolve,reject) {
		if(fileToParse.bank === 'belfius') {
			belfiusHeaders = "rekeningOpvrager;datumVerrichting;bogus1;bogus2;rekeningTegenpartij;naamTegenpartij;adres1Tegenpartij;adres2Tegenpartij;mededeling;datumOpdracht;bedrag;valuta;bic;land\r\n";
			fs.readFile(fileToParse.filename, {encoding:'utf8'}, function(err,data) {
				if(err) {
					reject(err);
				} else {
					console.log("Data reading done.");
					if(data.substring(0,10) === belfiusHeaders.substring(0,10)) {
						// All ok
						console.log("Headers already added.");
						resolve(fileToParse);
					} else {
						console.log("Adding headers.");
						var dataBuf = new Buffer(data);
						var buffer = new Buffer(belfiusHeaders);

						fs.open(fileToParse.filename, 'w+', function(err, fd) {
							if(err) {
								reject(err);
							} else {
								fs.write(fd, buffer, 0, buffer.length, function(err, written, buffer) {
									if(err) {
										reject(err);
									} else {
										fs.write(fd, dataBuf, 0, dataBuf.length, function(err, written, buffer) {
											if(err) {
												reject(err);
											} else {
												fs.close(fd);

												//Now all ok
												console.log("Headers added.");
												resolve(fileToParse);
											}
										});
									}
								});
							}
						});
					}		
				}
			});
		} else {
			resolve(fileToParse);
		}
	});
}

function determineBank(fileToParse) {
	return new Promise(function(resolve,reject) {
		var bankDotSplit = fileToParse.filename.split('.');
		var finalPart = bankDotSplit[bankDotSplit.length - 2];
		var bank = finalPart.split('/')[2];
		if(bank === "belfius" || bank === "argenta" || bank === "kbc") {
			fileToParse.bank = bank;
			console.log("Bank determined to be " + fileToParse.bank + ".");
			resolve(fileToParse);	
		} else {
			reject("No known bank");
		}
	});
}

function prepareFile(fileToParse) {
	return new Promise(function(resolve,reject) {
		if(fileToParse.bank === 'belfius') {
			resolve(fileToParse);
		} else if(fileToParse.bank === 'argenta') {
			fs.readFile(fileToParse.filename, function(err, data) {
				if (err) {
					reject(err);
				} else {
					data = data.toString();
					if(data.substring(0,15) === "Nr v/d rekening") {
						var position = data.indexOf('\n');
						position = data.indexOf('\n', position + 1);
						if (position == -1) {
							reject("No lines found in file.");
						} else {
							data = data.substr(position + 1);
							fs.writeFile(fileToParse.filename, data, function(err) { 
								if (err) { 
									reject(err);
								} else {
									console.log("Succesfully prepared file for argenta.");
									resolve(fileToParse);
								}
							});
						}	
					} else {
						console.log("File for argenta seems already prepared.");
						resolve(fileToParse);
					}
				}
			});
		} else if(fileToParse.bank === 'kbc') {
			fs.readFile(fileToParse.filename, function(err, data) {
				if (err) {
					reject(err);
				} else {
					data = data.toString();
					if(data.substring(0,26) === "Rekeningnummer;Rubrieknaam") {
						var position = data.indexOf('\r');
						console.log("position for KBC is: " + position);
						if (position == -1) {
							reject("No lines found in file.");
						} else {
							data = data.substr(position + 1);
							fs.writeFile(fileToParse.filename, data, function(err) { 
								if (err) { 
									reject(err);
								} else {
									console.log("Succesfully prepared file for KBC.");
									resolve(fileToParse);
								}
							});
						}	
					} else {
						console.log("File for KBC seems already prepared.");
						resolve(fileToParse);
					}
				}
			});
		} else {
			reject("Unknown bank.");
		}
	});
}

function determineHeaders(fileToParse) {
	return new Promise(function(resolve,reject) {
		if(fileToParse.bank === "belfius") {
			console.log("Bank is Belfius, adding headers to object");
			fileToParse.headers = "rekeningOpvrager;datumVerrichting;bogus1;bogus2;rekeningTegenpartij;naamTegenpartij;adres1Tegenpartij;adres2Tegenpartij;mededeling;datumOpdracht;bedrag;valuta;bic;land\r\n";
			resolve(fileToParse);
		} else if (fileToParse.bank === "argenta") {
			console.log("Bank is Argenta, adding headers to object");
			fileToParse.headers = "datumOpdracht;bankId;beschrijving;bedrag;valuta;datumVerrichting;rekeningTegenpartij;naamTegenpartij;mededeling;mededeling2\r\n";
			resolve(fileToParse);
		} else if (fileToParse.bank === "kbc") {
			console.log("Bank is KBC, adding headers to object");
			fileToParse.headers = "rekeningOpvrager;rubrieknaam;naamOpvrager;valuta;afschriftnummer;datumVerrichting;info;datumOpdracht;bedrag;saldo\r\n";
			resolve(fileToParse);
		} else {
			reject("Failed to retrieve headers for bank " + fileToParse.bank);
		}
	});
}

function addHeaders(fileToParse) {
	return new Promise(function(resolve,reject) {
		console.log("Starting to read data");
		fs.readFile(fileToParse.filename, {encoding:'utf8'}, function(err,data) {
			if(err) {
				reject(err);
			} else {
				console.log("Data reading done.");
				if(data.substring(0,10) === fileToParse.headers.substring(0,10)) {
					// All ok
					console.log("Headers already added.");
					resolve(fileToParse);
				} else {
					console.log("Adding headers.");
					var dataBuf = new Buffer(data);
					var buffer = new Buffer(fileToParse.headers);

					fs.open(fileToParse.filename, 'w+', function(err, fd) {
						if(err) {
							reject(err);
						} else {
							fs.write(fd, buffer, 0, buffer.length, function(err, written, buffer) {
								if(err) {
									reject(err);
								} else {
									fs.write(fd, dataBuf, 0, dataBuf.length, function(err, written, buffer) {
										if(err) {
											reject(err);
										} else {
											fs.close(fd);

											//Now all ok
											console.log("Headers added.");
											resolve(fileToParse);
										}
									});
								}
							});
						}
					});
				}		
			}
		});
	});
}

function fixNewlines(fileToParse) {
	return new Promise(function(resolve,reject) {
		if(fileToParse.bank === "kbc") {
			fs.readFile(fileToParse.filename, {encoding:'utf8'}, function(err,data) {
				if(err) {
					reject(err);
				} else {
					// got data
					data = data.replace('\r\n', '\n');
					data = data.replace('\n\r', '\n');
					data = data.replace('\r', '\n');
					var buffer = new Buffer(data);
					fs.open(fileToParse.filename, 'w+', function(err, fd) {
						if(err) {
							reject(err);
						} else {
							fs.write(fd, buffer, 0, buffer.length, function(err, written, buffer) {
								if(err) {
									reject(err);
								} else {
									fs.close(fd);
									console.log("Replaced newlines");
									resolve(fileToParse);
								}
							});
						}
					});
				}
			});
		} else {
			resolve(fileToParse);
		}
	});
}

/*
OLD VERSION USED WITH THE VOODOOTIKIGOD NODE-CSV LIBRARY
function processFile(fileToParse) {
	dataArray = [];
	return new Promise(function(resolve,reject) {
		csv.each(fileToParse.filename, {headers: true, strDelimiter:";"})
			.on('data', function(data) {
				if(data.bedrag) {
					dataArray.push(data);	
				} else {
					console.log("The following data was not retained: " + data);
				}				
			})
			.on('end', function() {
				fileToParse.dataArray = dataArray;
			  console.log("Finished processing " + fileToParse.filename + ".");
			  resolve(fileToParse);
			});
	});
}
*/

function processFile(fileToParse) {
	return new Promise(function(resolve,reject) {
		fs.readFile(fileToParse.filename, {encoding:'utf8'}, function(err,data) {
			if(err) {
				reject(err);
			} else {
				csvParse(data, {delimiter: ';', columns: true}, function(err,parsedData) {
					if(err) {
						reject(err);
					} else {
						fileToParse.dataArray = parsedData;
						resolve(fileToParse);	
					}
				});
			}
		});
	});
}

function mapDataFields(fileToParse) {
	return new Promise(function(resolve,reject) {
		if(fileToParse.bank === "belfius") {
			fileToParse.dataArray.forEach(function(data) {
				data.info = " - " + data.rekeningTegenpartij + " - " + data.naamTegenpartij + " - " + data.mededeling;
			});
			// Headers already provide good data fields

			resolve(fileToParse);
		} else if(fileToParse.bank === "argenta") {
			fileToParse.dataArray.forEach(function(data) {
				data.datumOpdracht = data['Valutadatum'];
				data.bankId = data['Ref. v/d verrichting'];
				data.beschrijving = data['Beschrijving'];
				data.bedrag = data['Bedrag v/d verrichting'];
				data.valuta = data['Munt'];
				data.datumVerrichting = data['Datum v. verrichting'];
				data.rekeningTegenpartij = data['Rekening tegenpartij'];
				data.naamTegenpartij = data['Naam v/d tegenpartij :'];
				data.mededeling = data['Mededeling 1 :'];
				data.mededeling2 = data['Mededeling 2 :'];

				data.info = data.beschrijving + " - " + data.rekeningTegenpartij + " - " + data.naamTegenpartij + " - " + data.mededeling + " - " +data.mededeling2;
			});

			resolve(fileToParse);
		} else if(fileToParse.bank === "kbc") {
			fileToParse.dataArray.forEach(function(data) {
				data.rekeningOpvrager = data.Rekeningnummer;
				data.rubrieknaam = data.Rubrieknaam;
				data.naamOpvrager = data.Naam;
				data.valuta = data.Munt;
				data.afschriftnummer = data.Afschriftnummer;
				data.datumVerrichting = data.Datum;
				data.info = data.Omschrijving;
				data.datumOpdracht = data.Valuta;
				data.bedrag = data.Bedrag;
				data.saldo = data.Saldo;	
			});
			
			resolve(fileToParse);
		} else {
			reject("No known bank.");
		}
	});
}

function prepareDataFields(fileToParse) {
	return new Promise(function(resolve,reject) {
		fileToParse.dataArray.forEach(function(data) {
			bedragString = data.bedrag.toString();
			bedragString = bedragString.replace('.', '');
			bedragString = bedragString.replace(',', '.');
			data.bedrag = parseFloat(bedragString);

			data.bank = fileToParse.bank;
			
			data.datumObject = moment(data.datumVerrichting, "DD-MM-YYYY");
		});
		resolve(fileToParse);
	});
} 

function persistVerrichtingen(fileToParse) {
	return new Promise(function(resolve,reject) {
		var promises = fileToParse.dataArray.map(function(data) {
			return verrichtingDA.saveVerrichting(data);	
		});
		return Promise.all(promises)
			.then(function(resultsArray) {
				console.log("All verrichtingen are persisted.");
				resolve(fileToParse);
			});
	});
}

function logCommand(fileToParse) {
	return new Promise(function(resolve,reject) {
		commandDA.saveCommand({commandType: 'import file', filename: fileToParse.filename})
			.then(function() {
				resolve(fileToParse);
			});
	});
}

