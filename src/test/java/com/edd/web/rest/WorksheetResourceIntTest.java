package com.edd.web.rest;

import com.edd.TextpadApp;

import com.edd.domain.Worksheet;
import com.edd.repository.WorksheetRepository;
import com.edd.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the WorksheetResource REST controller.
 *
 * @see WorksheetResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TextpadApp.class)
public class WorksheetResourceIntTest {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    @Autowired
    private WorksheetRepository worksheetRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restWorksheetMockMvc;

    private Worksheet worksheet;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        WorksheetResource worksheetResource = new WorksheetResource(worksheetRepository);
        this.restWorksheetMockMvc = MockMvcBuilders.standaloneSetup(worksheetResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Worksheet createEntity(EntityManager em) {
        Worksheet worksheet = new Worksheet()
            .text(DEFAULT_TEXT);
        return worksheet;
    }

    @Before
    public void initTest() {
        worksheet = createEntity(em);
    }

    @Test
    @Transactional
    public void createWorksheet() throws Exception {
        int databaseSizeBeforeCreate = worksheetRepository.findAll().size();

        // Create the Worksheet
        restWorksheetMockMvc.perform(post("/api/worksheets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(worksheet)))
            .andExpect(status().isCreated());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeCreate + 1);
        Worksheet testWorksheet = worksheetList.get(worksheetList.size() - 1);
        assertThat(testWorksheet.getText()).isEqualTo(DEFAULT_TEXT);
    }

    @Test
    @Transactional
    public void createWorksheetWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = worksheetRepository.findAll().size();

        // Create the Worksheet with an existing ID
        worksheet.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restWorksheetMockMvc.perform(post("/api/worksheets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(worksheet)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllWorksheets() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);

        // Get all the worksheetList
        restWorksheetMockMvc.perform(get("/api/worksheets?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(worksheet.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())));
    }

    @Test
    @Transactional
    public void getWorksheet() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);

        // Get the worksheet
        restWorksheetMockMvc.perform(get("/api/worksheets/{id}", worksheet.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(worksheet.getId().intValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingWorksheet() throws Exception {
        // Get the worksheet
        restWorksheetMockMvc.perform(get("/api/worksheets/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWorksheet() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);
        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();

        // Update the worksheet
        Worksheet updatedWorksheet = worksheetRepository.findOne(worksheet.getId());
        updatedWorksheet
            .text(UPDATED_TEXT);

        restWorksheetMockMvc.perform(put("/api/worksheets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedWorksheet)))
            .andExpect(status().isOk());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
        Worksheet testWorksheet = worksheetList.get(worksheetList.size() - 1);
        assertThat(testWorksheet.getText()).isEqualTo(UPDATED_TEXT);
    }

    @Test
    @Transactional
    public void updateNonExistingWorksheet() throws Exception {
        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();

        // Create the Worksheet

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restWorksheetMockMvc.perform(put("/api/worksheets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(worksheet)))
            .andExpect(status().isCreated());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteWorksheet() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);
        int databaseSizeBeforeDelete = worksheetRepository.findAll().size();

        // Get the worksheet
        restWorksheetMockMvc.perform(delete("/api/worksheets/{id}", worksheet.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Worksheet.class);
        Worksheet worksheet1 = new Worksheet();
        worksheet1.setId(1L);
        Worksheet worksheet2 = new Worksheet();
        worksheet2.setId(worksheet1.getId());
        assertThat(worksheet1).isEqualTo(worksheet2);
        worksheet2.setId(2L);
        assertThat(worksheet1).isNotEqualTo(worksheet2);
        worksheet1.setId(null);
        assertThat(worksheet1).isNotEqualTo(worksheet2);
    }
}
