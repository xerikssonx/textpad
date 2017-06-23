package com.edd.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.edd.domain.Worksheet;

import com.edd.repository.WorksheetRepository;
import com.edd.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Worksheet.
 */
@RestController
@RequestMapping("/api")
public class WorksheetResource {

    private final Logger log = LoggerFactory.getLogger(WorksheetResource.class);

    private static final String ENTITY_NAME = "worksheet";

    private final WorksheetRepository worksheetRepository;

    public WorksheetResource(WorksheetRepository worksheetRepository) {
        this.worksheetRepository = worksheetRepository;
    }

    /**
     * POST  /worksheets : Create a new worksheet.
     *
     * @param worksheet the worksheet to create
     * @return the ResponseEntity with status 201 (Created) and with body the new worksheet, or with status 400 (Bad Request) if the worksheet has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/worksheets")
    @Timed
    public ResponseEntity<Worksheet> createWorksheet(@RequestBody Worksheet worksheet) throws URISyntaxException {
        log.debug("REST request to save Worksheet : {}", worksheet);
        if (worksheet.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new worksheet cannot already have an ID")).body(null);
        }
        Worksheet result = worksheetRepository.save(worksheet);
        return ResponseEntity.created(new URI("/api/worksheets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /worksheets : Updates an existing worksheet.
     *
     * @param worksheet the worksheet to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated worksheet,
     * or with status 400 (Bad Request) if the worksheet is not valid,
     * or with status 500 (Internal Server Error) if the worksheet couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/worksheets")
    @Timed
    public ResponseEntity<Worksheet> updateWorksheet(@RequestBody Worksheet worksheet) throws URISyntaxException {
        log.debug("REST request to update Worksheet : {}", worksheet);
        if (worksheet.getId() == null) {
            return createWorksheet(worksheet);
        }
        Worksheet result = worksheetRepository.save(worksheet);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, worksheet.getId().toString()))
            .body(result);
    }

    /**
     * GET  /worksheets : get all the worksheets.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of worksheets in body
     */
    @GetMapping("/worksheets")
    @Timed
    public List<Worksheet> getAllWorksheets() {
        log.debug("REST request to get all Worksheets");
        return worksheetRepository.findAll();
    }

    /**
     * GET  /worksheets/:id : get the "id" worksheet.
     *
     * @param id the id of the worksheet to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the worksheet, or with status 404 (Not Found)
     */
    @GetMapping("/worksheets/{id}")
    @Timed
    public ResponseEntity<Worksheet> getWorksheet(@PathVariable Long id) {
        log.debug("REST request to get Worksheet : {}", id);
        Worksheet worksheet = worksheetRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(worksheet));
    }

    /**
     * DELETE  /worksheets/:id : delete the "id" worksheet.
     *
     * @param id the id of the worksheet to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/worksheets/{id}")
    @Timed
    public ResponseEntity<Void> deleteWorksheet(@PathVariable Long id) {
        log.debug("REST request to delete Worksheet : {}", id);
        worksheetRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
